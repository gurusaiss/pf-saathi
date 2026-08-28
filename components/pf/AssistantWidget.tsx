"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/session";
import { usePfRules } from "@/lib/usePfRules";
import { QA_LIBRARY, matchQuestion } from "@/lib/assistant";
import { SITE_ROUTES, matchRoute } from "@/lib/siteMap";
import { ChatIcon, MicIcon, CloseIcon, GridIcon, SendIcon } from "@/components/pf/Icons";

interface Message {
  role: "user" | "assistant";
  text: string;
}

type SpeechRecognitionEventLike = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

interface MinimalSpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

function getSpeechRecognitionCtor(): (new () => MinimalSpeechRecognition) | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => MinimalSpeechRecognition;
    webkitSpeechRecognition?: new () => MinimalSpeechRecognition;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function AssistantWidget() {
  const { persona, overrides, logout } = useSession();
  const rules = usePfRules();
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"chat" | "links">("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Ask me a question, or say/type a page name — like \"go to my funds\" or \"open FAQ\" — and I'll take you there.",
    },
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<MinimalSpeechRecognition | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Feature detection touches `window`, which doesn't exist during SSR — this
  // has to run post-mount, the same hydration-safe pattern used elsewhere.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVoiceSupported(getSpeechRecognitionCtor() !== null);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
      document.addEventListener("keydown", onEscape);
    }
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const respond = useCallback(
    (question: string) => {
      setMessages((m) => [...m, { role: "user", text: question }]);

      const route = matchRoute(question);
      if (route) {
        const isLogoutIntent = /log ?out|sign out/i.test(question);
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text: isLogoutIntent
              ? "Logging you out and taking you to the login page."
              : `Taking you to ${route.label}.`,
          },
        ]);
        window.setTimeout(() => {
          if (isLogoutIntent) logout();
          router.push(route.path);
          setOpen(false);
        }, 500);
        return;
      }

      let answer: string;
      if (persona && rules) {
        const match = matchQuestion(question);
        answer = match
          ? match.answer(persona, rules.results, overrides)
          : "I can't answer that confidently yet. Try one of the suggested questions, open Quick Links above to jump straight to a page, or check the FAQ.";
      } else {
        answer =
          "Log in first so I can answer questions about your account — or just tell me a page name, like \"go to FAQ\" or \"go to login page\".";
      }
      window.setTimeout(() => {
        setMessages((m) => [...m, { role: "assistant", text: answer }]);
      }, 300);
    },
    [persona, rules, overrides, router, logout]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    respond(input.trim());
    setInput("");
  }

  function toggleListening() {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new Ctor();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) respond(transcript);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  const quickQuestions = persona ? QA_LIBRARY.slice(0, 4) : [];

  return (
    <div className="fixed bottom-20 right-4 z-40 md:bottom-6">
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="PF Saathi assistant"
          className="mb-3 w-[22rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: "min(32rem, 70vh)" }}
        >
          <div className="flex items-center justify-between bg-[var(--primary)] text-white px-4 py-3">
            <span className="text-sm font-bold">PF Saathi Assistant</span>
            <button onClick={() => setOpen(false)} aria-label="Close assistant" className="text-white/80 hover:text-white">
              <CloseIcon className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          <div className="flex border-b border-[var(--border)] text-xs font-semibold">
            <button
              onClick={() => setView("chat")}
              className={`flex-1 py-2 flex items-center justify-center gap-1.5 ${
                view === "chat" ? "text-[var(--primary)] border-b-2 border-[var(--primary)]" : "text-[var(--muted)]"
              }`}
            >
              <ChatIcon className="h-3.5 w-3.5" strokeWidth={2} /> Ask
            </button>
            <button
              onClick={() => setView("links")}
              className={`flex-1 py-2 flex items-center justify-center gap-1.5 ${
                view === "links" ? "text-[var(--primary)] border-b-2 border-[var(--primary)]" : "text-[var(--muted)]"
              }`}
            >
              <GridIcon className="h-3.5 w-3.5" strokeWidth={2} /> Quick links
            </button>
          </div>

          {view === "chat" ? (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2 min-h-[12rem]">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-[88%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      m.role === "user"
                        ? "ml-auto bg-[var(--primary)] text-white"
                        : "bg-[var(--bg)] text-[var(--fg)]"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
              </div>

              {quickQuestions.length > 0 && (
                <div className="px-3 pb-2 flex flex-wrap gap-1.5">
                  {quickQuestions.map((qa) => (
                    <button
                      key={qa.id}
                      onClick={() => respond(qa.question)}
                      className="text-[10px] font-medium rounded-full border border-[var(--border)] px-2 py-1 hover:border-[var(--primary)]"
                    >
                      {qa.question}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex items-center gap-1.5 border-t border-[var(--border)] p-2.5">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={listening ? "Listening…" : "Ask or say a page name…"}
                  className="flex-1 min-w-0 rounded-lg border border-[var(--border)] px-3 py-2 text-xs"
                />
                {voiceSupported && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    aria-pressed={listening}
                    aria-label={listening ? "Stop voice input" : "Start voice input"}
                    className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                      listening
                        ? "border-[var(--bad)] bg-[var(--bad-bg)] text-[var(--bad)] animate-pulse"
                        : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    }`}
                  >
                    <MicIcon className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                )}
                <button
                  type="submit"
                  aria-label="Send"
                  className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
                >
                  <SendIcon className="h-4 w-4" strokeWidth={1.8} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-2.5 grid grid-cols-1 gap-1.5">
              {SITE_ROUTES.map((r) => (
                <button
                  key={r.path}
                  onClick={() => {
                    router.push(r.path);
                    setOpen(false);
                  }}
                  className={`text-left rounded-xl border p-2.5 transition-colors ${
                    pathname === r.path
                      ? "border-[var(--primary)] bg-[var(--bg)]"
                      : "border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--bg)]"
                  }`}
                >
                  <p className="text-xs font-semibold">{r.label}</p>
                  <p className="text-[11px] text-[var(--muted)] mt-0.5">{r.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open PF Saathi assistant"}
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg hover:bg-[var(--primary-dark)] transition-colors"
      >
        {open ? <CloseIcon className="h-5 w-5" strokeWidth={2} /> : <ChatIcon className="h-6 w-6" strokeWidth={1.8} />}
      </button>
    </div>
  );
}
