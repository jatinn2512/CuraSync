import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/Button";

type ChatRole = "user" | "bot";

type ChatMessage = {
  id: number;
  role: ChatRole;
  text: string;
};

const quickPrompts = ["Instant alert kaise use karu?", "Food scan ka button kaha hai?", "Smartwatch sync kaise kare?", "Profile autofill kaise hota hai?"] as const;

const getBotReply = (input: string): string => {
  const normalized = input.trim().toLowerCase();

  if (!normalized) {
    return "Apna question likho, main app feature ke hisaab se guide kar dunga.";
  }

  if (
    normalized.includes("emergency") ||
    normalized.includes("severe chest pain") ||
    normalized.includes("cannot breathe") ||
    normalized.includes("unconscious")
  ) {
    return "Agar severe emergency symptoms hain to turant local emergency service ya nearest hospital contact karo. App guidance emergency care ka replacement nahi hai.";
  }

  if (normalized.includes("instant") || normalized.includes("alert") || normalized.includes("risk")) {
    return "Sidebar me Instant Alert open karo, form fill karo (N/A options available), phir Generate Instant Alert dabao. Output me Heart Attack/Asthma/Diabetes/Hypertension risk percentages aur history milti hai.";
  }

  if (normalized.includes("camera") || normalized.includes("scan") || normalized.includes("ocr")) {
    return "Camera autofill Profile, Instant Alert aur Food pages me available hai. Button dabao, photo capture/upload karo, app QR + readable text dono se fields parse karne ki koshish karta hai.";
  }

  if (normalized.includes("smartwatch") || normalized.includes("bluetooth") || normalized.includes("steps") || normalized.includes("heart rate")) {
    return "Settings page me Smartwatch Integration card use karo. Connect dabao (supported browser me Bluetooth request aayega), then sensor values sync karo. Data backend logs me save hota hai.";
  }

  if (normalized.includes("profile")) {
    return "Profile page me expanded medical form hai: height, weight, eyesight, disability, chronic conditions, allergies, smoking, alcohol, notes. Scan & Autofill se camera data bhi map ho sakta hai.";
  }

  if (normalized.includes("food")) {
    return "Food page me Scan Food button se camera analysis hota hai. QR/text mila to dish hint detect hota hai, warna image tone based fallback risk estimate diya jata hai.";
  }

  if (normalized.includes("login") || normalized.includes("register")) {
    return "Agar login flow odd lag raha hai, pehle logout karo ya browser storage clear karke retry karo. Default landing page root home hai, auth pages alag routes par hain.";
  }

  return "Main app-related help de sakta hoon: login flow, profile form, camera autofill, instant alert, food scan, smartwatch sync. Bas feature ka naam bolo.";
};

const initialMessage: ChatMessage = {
  id: 1,
  role: "bot",
  text: "Main CuraSync assistant hoon. App features use karne me help chahiye to yahi pucho.",
};

const HealthChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const canSend = useMemo(() => draft.trim().length > 0, [draft]);

  const sendMessage = (value: string) => {
    const message = value.trim();
    if (!message) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      text: message,
    };
    const botMessage: ChatMessage = {
      id: Date.now() + 1,
      role: "bot",
      text: getBotReply(message),
    };
    setMessages((prev) => [...prev, userMessage, botMessage]);
    setDraft("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(draft);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[90] sm:bottom-6 sm:right-6">
      {isOpen ? (
        <section className="flex h-[28rem] w-[min(92vw,24rem)] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_24px_60px_-25px_hsl(218_38%_9%/0.8)]">
          <div className="flex items-center justify-between border-b border-border/60 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Bot className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">Health Assistant</p>
                <p className="text-[11px] text-muted-foreground">App support chat</p>
              </div>
            </div>
            <Button type="button" size="icon" variant="ghost" className="h-8 w-8 rounded-lg" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((message) => (
              <div key={message.id} className={`max-w-[86%] rounded-xl px-3 py-2 text-sm ${message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "border border-border/60 bg-card/65"}`}>
                {message.text}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border/60 px-3 py-2">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-border/60 bg-card px-2.5 py-1 text-[11px] text-muted-foreground hover:border-primary/35 hover:text-foreground"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form className="flex gap-2" onSubmit={handleSubmit}>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Type your question..."
                className="h-9 w-full rounded-lg border border-border/60 bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-primary/25"
              />
              <Button type="submit" size="icon" className="h-9 w-9 rounded-lg" disabled={!canSend}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </section>
      ) : (
        <Button type="button" size="icon" className="h-12 w-12 rounded-full shadow-soft" onClick={() => setIsOpen(true)} title="Open health assistant">
          <MessageCircle className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default HealthChatbot;
