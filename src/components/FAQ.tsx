"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
  title?: string;
}

export default function FAQ({ faqs, title = "سوالات متداول" }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="section" style={{ background: "#f8f9fa" }}>
      <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "24px",
            marginBottom: "24px",
            textAlign: "center",
            color: "#1a1a1a",
          }}
        >
          ❓ {title}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                style={{
                  background: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #e5e5e5",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  style={{
                    width: "100%",
                    padding: "16px 20px",
                    background: "transparent",
                    border: "none",
                    textAlign: "right",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "#1a1a1a",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    fontFamily: "inherit",
                  }}
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <span
                    style={{
                      fontSize: "20px",
                      transition: "transform 0.3s",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      color: "#0066cc",
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: "0 20px 20px",
                      color: "#444",
                      lineHeight: 1.9,
                      borderTop: "1px solid #f0f0f0",
                      paddingTop: "16px",
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}