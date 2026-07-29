"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import InteractiveStarfield from "@/components/ui/interactive-starfield";

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

type HomeExperienceProps = {
  initialView?: "home" | "about" | "works";
};

const selectedWorks = [
  {
    title: "Lojas Renner - App Reposição",
    image: "/lojas-renner-app-reposicao.jpg",
  },
  {
    title: "Sicredi Previdência - Portabilidade Multifundos",
    image: "/sicredi-portabilidade-multifundos.jpg",
  },
  { title: "PanVel - PDV móvel", image: "/panvel-pdv-movel.jpg" },
  { title: "PanVel - Self-checkout", image: "/panvel-self-checkout.jpg" },
  { title: "PanVel - App omniPedidos", image: "/panvel-omni-pedidos.jpg" },
  { title: "PanVel - omniPDV", image: "/panvel-omni-pdv.jpg" },
];

const awards = [
  { date: "Ago de 2022", title: "Prêmio As 100+ Inovadoras no Uso de TI", issuer: "IT Mídia em parceria com a FIAP", association: "Grupo PanVel" },
  { date: "Nov de 2021", title: "Prêmio ABRAPPE 2021 - Melhor case de inovação", issuer: "ABRAPPE", association: "Grupo PanVel" },
  { date: "Out de 2020", title: "GROW+ Innovation Awards - categoria Inovação Aberta", issuer: "GROW+ Innovation Awards", association: "Grupo PanVel" },
  { date: "Mai de 2019", title: "Loja Referência no Varejo Experience", issuer: "Sindilojas Porto Alegre", association: "Grupo PanVel" },
  { date: "Nov de 2018", title: "Empresa Inovadora em TIC de SUCESU-RS", issuer: "SUCESU-RS", association: "Grupo PanVel" },
  { date: "Out de 2018", title: "Prêmio As 100+ Inovadoras no Uso de TI - Grupo PanVel", issuer: "IT Mídia em parceria com a PwC", association: "Grupo PanVel" },
  { date: "Dez de 2015", title: "Prêmio RBS de Jornalismo e Entretenimento - APPs Colorado ZH e Gremista ZH - Narração Torcedora - categoria Novo Formato", issuer: "Grupo RBS", association: "Grupo RBS" },
  { date: "Out de 2015", title: "Prêmio Digital Mídia - América Latina 2015 - Colorado ZH e Gremista ZH, com site, mobile site e aplicativos - categoria Melhor Novo Produto", issuer: "WAN-IFRA", association: "Grupo RBS" },
  { date: "Dez de 2011", title: "Prêmio RBS de Jornalismo e Entretenimento - Site RuralBR - categoria Inovação", issuer: "Grupo RBS", association: "Grupo RBS" },
  { date: "Nov de 2004", title: "Prêmio Detran-RS Publicidade pela Vida - 6ª Edição", issuer: "PUCRS", association: "PUCRS", associationLabel: "Associado a" },
];

export default function HomeExperience({
  initialView = "home",
}: HomeExperienceProps) {
  const router = useRouter();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAwardsOpen, setIsAwardsOpen] = useState(false);
  const [isLeavingAbout, setIsLeavingAbout] = useState(false);
  const [isLeavingWorks, setIsLeavingWorks] = useState(false);
  const [selectedWork, setSelectedWork] = useState(0);
  const contactTriggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const awardsTriggerRef = useRef<HTMLButtonElement>(null);
  const awardsCloseButtonRef = useRef<HTMLButtonElement>(null);
  const isAbout = initialView === "about";
  const isWorks = initialView === "works";

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/sobre");
    router.prefetch("/trabalhos");
  }, [router]);

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
    const supportsPrecisePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    if (supportsPrecisePointer) {
      closeButtonRef.current?.focus();
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (supportsPrecisePointer) {
        contactTrigger?.focus();
      }
    };
  }, [isContactOpen]);

  useEffect(() => {
    if (!isAwardsOpen) return;

    const awardsTrigger = awardsTriggerRef.current;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsAwardsOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const supportsPrecisePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    if (supportsPrecisePointer) {
      awardsCloseButtonRef.current?.focus({ preventScroll: true });
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (supportsPrecisePointer) {
        awardsTrigger?.focus({ preventScroll: true });
      }
    };
  }, [isAwardsOpen]);

  return (
    <main
      className={`home-screen${isAbout ? " about-screen" : ""}${
        isWorks ? " works-screen" : ""
      }${
        isLeavingAbout ? " is-leaving-about" : ""
      }${isLeavingWorks ? " is-leaving-works" : ""}${
        isAwardsOpen ? " is-awards-open" : ""
      }`}
      id="inicio"
    >
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>

      {!isAbout && !isWorks && (
        <InteractiveStarfield
          particleCount={360}
          interactionRadius={155}
          particleColor="#5846CA"
          activeColor="#DDD8FF"
          speed={0.52}
        />
      )}

      <header className="home-header">
        <Link
          className="full-name"
          href="/"
          aria-label="Vicente Bortolini — início"
          onClick={(event) => {
            if ((!isAbout && !isWorks) || isLeavingAbout || isLeavingWorks) {
              return;
            }

            event.preventDefault();

            const prefersReducedMotion = window.matchMedia(
              "(prefers-reduced-motion: reduce)",
            ).matches;

            if (prefersReducedMotion) {
              router.push("/");
              return;
            }

            if (isAbout) {
              setIsLeavingAbout(true);
            } else {
              setIsLeavingWorks(true);
            }
          }}
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
        <Link
          className={`edge-link edge-link-left${isWorks ? " is-active" : ""}`}
          href="/trabalhos"
          aria-current={isWorks ? "page" : undefined}
          onClick={() => setIsLeavingWorks(false)}
        >
          <span>Trabalhos</span>
        </Link>
        <Link
          className={`edge-link edge-link-right${isAbout ? " is-active" : ""}`}
          href="/sobre"
          aria-current={isAbout ? "page" : undefined}
          onClick={() => setIsLeavingAbout(false)}
        >
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

      {isAbout ? (
        <section
          className="about-content"
          id="conteudo"
          aria-labelledby="about-title"
          onAnimationEnd={(event) => {
            if (
              isLeavingAbout &&
              event.animationName === "about-slide-out"
            ) {
              router.push("/");
            }
          }}
        >
          <div className="about-photo" aria-hidden="true">
            <Image
              src="/vicente-bortolini-perfil.jpeg"
              alt=""
              fill
              priority
              unoptimized
              sizes="(max-width: 760px) 100vw, 50vw"
            />
          </div>

          <div className="about-copy">
            <h1 className="sr-only" id="about-title">
              Sobre Vicente Bortolini
            </h1>
            <p>
              Sou especialista em Product Design, UX Strategy e transformação
              digital, com sólida experiência na criação de produtos digitais
              escaláveis para web, mobile, tablets e ecossistemas omnichannel.
              Atuo conectando negócio, tecnologia e experiência do usuário para
              desenvolver soluções digitais com impacto real em operação,
              vendas, eficiência e experiência do cliente.
            </p>
            <p>
              Ao longo da minha trajetória, participei da concepção e evolução
              de plataformas de jornalismo e mídia digital, e-commerce,
              aplicativos, sistemas de PDV (POS), self-checkout, produtos
              omnichannel, dashboards e soluções digitais internas para
              operação e logística do varejo e instituições financeiras.
            </p>
            <p className="about-expertise-title">Tenho atuação forte em:</p>
            <p className="about-expertise">
              Product Design | UX/UI Design | Product Strategy | Design Systems
              | Discovery &amp; Delivery | Omnichannel Experience | Jornada do
              Usuário | Transformação Digital | Inteligência Artificial
              aplicada ao Design | Prototipação | Arquitetura de Informação |
              Design Ops | Agile / Scrum | Figma | Experiência em varejo e
              e-commerce | Fintech &amp; Financial
            </p>
            <button
              ref={awardsTriggerRef}
              className="awards-link"
              id="premiacoes"
              type="button"
              aria-haspopup="dialog"
              aria-expanded={isAwardsOpen}
              aria-controls="awards-drawer"
              onClick={() => setIsAwardsOpen(true)}
            >
              Premiações / Reconhecimentos
            </button>
          </div>
        </section>
      ) : isWorks ? (
        <section
          className="works-content"
          id="conteudo"
          aria-labelledby="works-title"
          onAnimationEnd={(event) => {
            if (
              isLeavingWorks &&
              event.animationName === "works-slide-out"
            ) {
              router.push("/");
            }
          }}
        >
          <div className="works-list-panel">
            <h1 id="works-title">Trabalhos selecionados</h1>

            <div className="works-list" role="list">
              {selectedWorks.map((work, index) => (
                <div
                  className={`work-item${
                    selectedWork === index ? " is-selected" : ""
                  }`}
                  role="listitem"
                  key={work.title}
                >
                  <button
                    className="work-title"
                    type="button"
                    aria-pressed={selectedWork === index}
                    onClick={() => setSelectedWork(index)}
                  >
                    {work.title}
                  </button>
                  {selectedWork === index && (
                    <button className="awards-link work-project-link" type="button">
                      Visualizar projeto
                    </button>
                  )}
                </div>
              ))}
            </div>

            <a
              className="awards-link works-more-link"
              href="https://www.behance.net/vicentebortolini"
              target="_blank"
              rel="noreferrer"
            >
              Veja mais projetos aqui
            </a>
          </div>

          <div
            className="works-preview has-cover"
            aria-label={`Imagem do projeto ${selectedWorks[selectedWork].title}`}
            role="img"
          >
            <Image
              key={selectedWorks[selectedWork].image}
              className="works-preview-image"
              src={selectedWorks[selectedWork].image}
              alt=""
              fill
              priority={selectedWork === 0}
              quality={72}
              sizes="50vw"
            />
          </div>
        </section>
      ) : (
        <section className="home-hero" id="conteudo" aria-labelledby="home-title">
          <h1 id="home-title">
            Olá, sou <strong className="role-emphasis">Product Designer</strong>
            <span className="hero-line">com foco em UX/UI design</span>
          </h1>
        </section>
      )}

      {isAbout && (
        <div
          className={`awards-overlay${isAwardsOpen ? " is-open" : ""}`}
          aria-hidden={!isAwardsOpen}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsAwardsOpen(false);
            }
          }}
        >
          <section
            className="awards-drawer"
            id="awards-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="awards-title"
          >
            <header className="awards-header">
              <h2 className="awards-title" id="awards-title">
                Premiações / Reconhecimentos
              </h2>
              <button
                ref={awardsCloseButtonRef}
                className="contact-close awards-close"
                type="button"
                aria-label="Fechar premiações e reconhecimentos"
                onClick={() => setIsAwardsOpen(false)}
              >
                <span aria-hidden="true" />
              </button>
            </header>

            <div className="awards-list">
              {awards.map((award) => (
                <article className="award-item" key={`${award.date}-${award.title}`}>
                  <time>{award.date}</time>
                  <h3>{award.title}</h3>
                  <p>Emitido por {award.issuer}</p>
                  <p>
                    {award.associationLabel ?? "Associado ao"}{" "}
                    <strong>{award.association}</strong>
                  </p>
                </article>
              ))}
              <a
                className="awards-link awards-details-link"
                href="https://www.linkedin.com/in/vicentebortolini/details/honors/"
                target="_blank"
                rel="noreferrer"
                aria-label="Ver mais detalhes das premiações no LinkedIn — abre em uma nova aba"
              >
                Ver mais detalhes
              </a>
            </div>
          </section>
        </div>
      )}

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
