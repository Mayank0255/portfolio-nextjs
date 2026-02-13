"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        throw new Error("Chat request failed");
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader");

      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                assistantText += parsed.text;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: "assistant",
                    content: assistantText,
                  };
                  return updated;
                });
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 md:right-8 w-[360px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-8rem)] z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-[var(--card-border)] bg-[var(--background)]"
          style={{ animation: "chatSlideUp 0.3s ease-out" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--link-color)] text-white shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                M
              </div>
              <div>
                <p className="font-semibold text-sm leading-tight">Ask about Mayank</p>
                <p className="text-xs opacity-80">AI-powered assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-[var(--link-color)]/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[var(--link-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-[var(--foreground)]">Hi there!</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Ask me anything about Mayank&apos;s experience, skills, or projects.
                </p>
                <div className="flex flex-wrap gap-2 justify-center mt-4">
                  {["What does Mayank do?", "Tell me about his projects", "What are his skills?"].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setInput(q);
                        setTimeout(() => {
                          const fakeMsg: Message = { role: "user", content: q };
                          const newMsgs = [fakeMsg];
                          setMessages(newMsgs);
                          setInput("");
                          setIsStreaming(true);
                          fetch("/api/chat", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ messages: newMsgs }),
                          }).then(async (res) => {
                            if (!res.ok) throw new Error();
                            const reader = res.body?.getReader();
                            if (!reader) return;
                            const decoder = new TextDecoder();
                            let text = "";
                            setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
                            while (true) {
                              const { done, value } = await reader.read();
                              if (done) break;
                              const chunk = decoder.decode(value, { stream: true });
                              for (const line of chunk.split("\n")) {
                                if (line.startsWith("data: ")) {
                                  const d = line.slice(6);
                                  if (d === "[DONE]") break;
                                  try {
                                    const parsed = JSON.parse(d);
                                    if (parsed.text) {
                                      text += parsed.text;
                                      setMessages((prev) => {
                                        const u = [...prev];
                                        u[u.length - 1] = { role: "assistant", content: text };
                                        return u;
                                      });
                                    }
                                  } catch { /* skip */ }
                                }
                              }
                            }
                          }).catch(() => {
                            setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
                          }).finally(() => setIsStreaming(false));
                        }, 0);
                      }}
                      className="text-xs px-3 py-1.5 rounded-full border border-[var(--card-border)] text-[var(--link-color)] hover:bg-[var(--link-color)] hover:text-white transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[var(--link-color)] text-white rounded-br-md"
                      : "bg-[var(--card-bg)] text-[var(--foreground)] border border-[var(--card-border)] rounded-bl-md"
                  }`}
                >
                  {msg.content || (
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 p-3 border-t border-[var(--card-border)] bg-[var(--background)]">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Mayank..."
                disabled={isStreaming}
                className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--foreground)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--link-color)] disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isStreaming}
                className="p-2.5 rounded-xl bg-[var(--link-color)] text-white hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:right-8 z-50 w-14 h-14 rounded-full bg-[var(--link-color)] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        aria-label="Chat with AI assistant"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>
    </>
  );
}
