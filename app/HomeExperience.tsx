"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import InteractiveStarfield from "./InteractiveStarfield";

const BehanceIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 32 32"
    role="img"
    focusable="false"
  >
    <path d="M3.5 6.5h10.2c4.1 0 6.7 1.8 6.7 5.3 0 2.1-1 3.7-2.8 4.5 2.5.7 3.8 2.7 3.8 5.3 0 4.1-3.5 6.1-7.8 6.1H3.5V6.5Zm5 8.4h4.8c1.7 0 2.9-.8 2.9-2.6 0-2-1.5-2.5-3.2-2.5H8.5v5.1Zm0 9.2h5.1c1.9 0 3.5-.6 3.5-2.9 0-2.2-1.4-3.1-3.4-3.1H8.5v6Zm14.6-15h7.1v2.4h-7.1V9.1Zm8.5 11.9H20.5c.1 2.7 1.4 3.9 3.8 3.9 1.7 0 3.1-1.1 3.4-2h3.6c-1.2 3.5-3.6 5.1-7.2 5.1-4.8 0-7.8-3.3-7.8-8.1 0-4.6 3.2-8.1 7.8-8.1 5.2 0 7.7 4.4 7.4 9.2Zm-11.1-2.7h6.9c-.4-2.1-1.3-3.2-3.3-3.2-2.6 0-3.4 2.1-3.6 3.2Z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 32 32"
    role="img"
    focusable="false"
  >
    <path d="M7.2 10.7H2V27h5.2V10.7ZM4.6 3C2.9 3 1.8 4.1 1.8 5.6s1.1 2.6 2.7 2.6c1.7 0 2.8-1.1 2.8-2.6S6.2 3 4.6 3ZM27.8 17.7c0-5-2.7-7.4-6.2-7.4-2.9 0-4.2 1.6-4.9 2.7v-2.3h-5.2V27h5.2v-9.1c0-.5 0-1 .2-1.3.4-1 1.3-2.1 2.9-2.1 2 0 2.8 1.5 2.8 3.8V27h5.2v-9.3Z" />
  </svg>
);

export default function HomeExperience() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const contactTriggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isContactOpen) {
      return;
    }

    const contactTrigger = contactTriggerRef.current;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsContactOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      contactTrigger?.focus();
    };
  }, [isContactOpen]);

  return (
    <main className="home-screen" id="inicio">
      <InteractiveStarfield />

      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>

      <header className="home-header">
        <Link
          className="full-name"
          href="/"
          aria-label="Vicente Bortolini — início"
        >
          Vicente Bortolini
        </Link>

        <nav className="social-links" aria-label="Redes sociais">
          <a
            href="https://www.behance.net/vicentebortolini"
            target="_blank"
            rel="noreferrer"
            aria-label="Behance de Vicente Bortolini — abre em uma nova aba"
          >
            <BehanceIcon />
          </a>
          <a
            href="https://www.linkedin.com/in/vicentebortolini/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn de Vicente Bortolini — abre em uma nova aba"
          >
            <LinkedInIcon />
          </a>
        </nav>
      </header>

      <nav className="edge-navigation" aria-label="Navegação principal">
        <Link className="edge-link edge-link-left" href="/trabalhos">
          <span>Trabalhos</span>
        </Link>
        <Link className="edge-link edge-link-right" href="/sobre">
          <span>Sobre</span>
        </Link>
        <button
          ref={contactTriggerRef}
          className="edge-link edge-link-bottom contact-trigger"
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isContactOpen}
          aria-controls="contact-drawer"
          onClick={() => setIsContactOpen(true)}
        >
          <span>Contatos</span>
        </button>
      </nav>

      <section className="home-hero" id="conteudo" aria-labelledby="home-title">
        <h1 id="home-title">
          Olá, sou <strong className="role-emphasis">Product Designer</strong>
          <span className="hero-line">com foco em UI/UX design</span>
        </h1>
      </section>

      <div
        className={`contact-overlay${isContactOpen ? " is-open" : ""}`}
        aria-hidden={!isContactOpen}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setIsContactOpen(false);
          }
        }}
      >
        <section
          className="contact-drawer"
          id="contact-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-title"
        >
          <h2 className="contact-title" id="contact-title">
            Contatos
          </h2>

          <button
            ref={closeButtonRef}
            className="contact-close"
            type="button"
            aria-label="Fechar contatos"
            onClick={() => setIsContactOpen(false)}
          >
            <span aria-hidden="true" />
          </button>

          <div className="contact-details">
            <p>
              <span className="contact-label">WhatsApp:</span>{" "}
              <span className="contact-value">51982306185</span>
            </p>
            <p>
              <span className="contact-label">E-mail:</span>{" "}
              <span className="contact-value">vicenteb@gmail.com</span>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
