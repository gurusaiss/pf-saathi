"use client";

import { useState, useRef, useEffect } from "react";
import { Shell } from "@/components/pf/Shell";
import { PageSkeleton } from "@/components/pf/PageSkeleton";
import { Card } from "@/components/ui/Card";
import { useSession } from "@/lib/session";
import { usePfRules } from "@/lib/usePfRules";
import { QA_LIBRARY, matchQuestion } from "@/lib/assistant";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function Ask() {
  const { persona, overrides } = useSession();
  const rules = usePfRules();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Ask me anything about your PF — where your money is, why a claim was rejected, or what a term means. Pick a question below or type your own.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  if (!persona || !rules) return <Shell><PageSkeleton /></Shell>;

  function ask(question: string) {
    setMessages((m) => [...m, { role: "user", text: question }]);
    const match = matchQuestion(question);
    const answer = match
      ? match.answer(persona!, rules!.results, overrides)
      : "I can't answer that one confidently yet — try one of the suggested questions below, or check the relevant section: PF Journey, Claims, Contributions, or Family & Nomination.";
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: answer }]);
    }, 300);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    ask(input.trim());
    setInput("");
  }

  return (
    <Shell>
      <h1 className="text-xl font-bold mb-1">Ask</h1>
      <p className="text-sm text-[var(--muted)] mb-4">
        Grounded in your own account — not a generic FAQ.
      </p>

      <Card className="mb-4">
        <div ref={scrollRef} className="max-h-[420px] overflow-y-auto space-y-3 pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "ml-auto bg-[var(--primary)] text-[var(--primary-fg)]"
                  : "bg-[var(--bg)] text-[var(--fg)]"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>
      </Card>

      <div className="mb-4 flex flex-wrap gap-2">
        {QA_LIBRARY.map((qa) => (
          <button
            key={qa.id}
            onClick={() => ask(qa.question)}
            className="text-xs font-medium rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 hover:border-[var(--primary)]"
          >
            {qa.question}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          className="flex-1 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm"
        />
        <button
          type="submit"
          className="rounded-xl bg-[var(--primary)] text-[var(--primary-fg)] px-4 py-2.5 text-sm font-semibold"
        >
          Send
        </button>
      </form>
    </Shell>
  );
}
