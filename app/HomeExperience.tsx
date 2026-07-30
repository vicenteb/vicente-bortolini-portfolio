"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import InteractiveStarfield from "@/components/ui/interactive-starfield";
import SkeletonImage from "@/components/ui/skeleton-image";

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
  initialView?:
    | "home"
    | "about"
    | "works"
    | "rennerProject"
    | "sicrediProject"
    | "panvelPdvMovelProject"
    | "panvelSelfCheckoutProject"
    | "panvelOmniPedidosProject"
    | "panvelOmniPdvProject";
};

const selectedWorks = [
  {
    title: "Lojas Renner - App Reposição",
    image: "/lojas-renner-app-reposicao.jpg",
    projectHref: "/trabalhos/lojas-renner-app-reposicao",
  },
  {
    title: "Sicredi Previdência - Portabilidade Multifundos",
    image: "/sicredi-portabilidade-multifundos.jpg",
    projectHref: "/trabalhos/sicredi-portabilidade-multifundos",
  },
  {
    title: "PanVel - PDV móvel",
    image: "/panvel-pdv-movel.jpg",
    projectHref: "/trabalhos/panvel-pdv-movel",
  },
  {
    title: "PanVel - Self-checkout",
    image: "/panvel-self-checkout.jpg",
    projectHref: "/trabalhos/panvel-self-checkout",
  },
  {
    title: "PanVel - App omniPedidos",
    image: "/panvel-omni-pedidos.jpg",
    projectHref: "/trabalhos/panvel-app-omni-pedidos",
  },
  {
    title: "PanVel - omniPDV",
    image: "/panvel-omni-pdv.jpg",
    projectHref: "/trabalhos/panvel-omnipdv",
  },
];

const rennerProjectImages = [
  { src: "/lojas-renner-app-reposicao.jpg", width: 1400, height: 2900 },
  { src: "/renner-02-problema.jpg", width: 1400, height: 2254 },
  { src: "/renner-03-login.jpg", width: 1400, height: 2254 },
  { src: "/renner-04-perfis.jpg", width: 1400, height: 2036 },
  { src: "/renner-05-vendas-bipagem.jpg", width: 1400, height: 2036 },
  { src: "/renner-06-vendas-produto.jpg", width: 1400, height: 2900 },
  { src: "/renner-07-vendas-confirmacao.jpg", width: 1400, height: 2036 },
  { src: "/renner-08-estoque-solicitacao.jpg", width: 1400, height: 2036 },
  { src: "/renner-09-estoque-status.jpg", width: 1400, height: 2036 },
  { src: "/renner-10-estoque-separacao.jpg", width: 1400, height: 2528 },
  { src: "/renner-11-estoque-final.jpg", width: 1400, height: 2036 },
  { src: "/renner-12-design-system.jpg", width: 1400, height: 2900 },
  { src: "/renner-13-tecnologias.jpg", width: 1400, height: 2900 },
  { src: "/renner-14-encerramento.jpg", width: 1400, height: 2476 },
  { src: "/renner-15-agilize-renner.jpg", width: 1400, height: 2480 },
];

const sicrediProjectImages = [
  { src: "/sicredi-case-01.jpg", width: 1055, height: 1493 },
  { src: "/sicredi-case-02.jpg", width: 1055, height: 1491 },
  { src: "/sicredi-case-03.jpg", width: 1055, height: 1491 },
  { src: "/sicredi-case-04.jpg", width: 1055, height: 1628 },
  { src: "/sicredi-case-05.jpg", width: 1055, height: 1470 },
  { src: "/sicredi-case-06.jpg", width: 1055, height: 1330 },
  { src: "/sicredi-case-07.jpg", width: 1055, height: 1080 },
  { src: "/sicredi-case-08.jpg", width: 1055, height: 1080 },
  { src: "/sicredi-case-09.jpg", width: 1055, height: 1399 },
  { src: "/sicredi-case-10.jpg", width: 1055, height: 1865 },
  { src: "/sicredi-case-11.jpg", width: 1055, height: 1531 },
  { src: "/sicredi-case-12.jpg", width: 1055, height: 1452 },
  { src: "/sicredi-case-13.jpg", width: 1055, height: 1452 },
  { src: "/sicredi-case-14.jpg", width: 1055, height: 1318 },
  { src: "/sicredi-case-15.jpg", width: 1055, height: 1664 },
];

const panvelPdvMovelProjectImages = [
  { src: "/panvel-pdv-movel-case-01.jpg", width: 1054, height: 1492 },
  { src: "/panvel-pdv-movel-case-02.jpg", width: 1055, height: 1491 },
  { src: "/panvel-pdv-movel-case-03.jpg", width: 1055, height: 1491 },
  { src: "/panvel-pdv-movel-case-04.jpg", width: 1055, height: 1491 },
  { src: "/panvel-pdv-movel-case-05.jpg", width: 1055, height: 1491 },
  { src: "/panvel-pdv-movel-case-06.jpg", width: 1055, height: 1491 },
  { src: "/panvel-pdv-movel-case-07.jpg", width: 1055, height: 1491 },
  { src: "/panvel-pdv-movel-case-08.jpg", width: 1055, height: 1491 },
  { src: "/panvel-pdv-movel-case-09.jpg", width: 1055, height: 1491 },
  { src: "/panvel-pdv-movel-case-10.jpg", width: 1054, height: 1493 },
];

const panvelSelfCheckoutProjectImages = Array.from(
  { length: 23 },
  (_, index) => ({
    src: `/panvel-self-checkout-case-${String(index + 1).padStart(2, "0")}.jpg`,
    width: 1055,
    height: 1491,
  }),
);

const panvelOmniPedidosProjectImages = [
  { src: "/panvel-omni-pedidos-case-01.jpg", width: 1001, height: 1572 },
  { src: "/panvel-omni-pedidos-case-02.jpg", width: 1001, height: 1572 },
  { src: "/panvel-omni-pedidos-case-03.jpg", width: 1001, height: 1572 },
  { src: "/panvel-omni-pedidos-case-04.jpg", width: 1001, height: 1572 },
  { src: "/panvel-omni-pedidos-case-05.jpg", width: 1000, height: 1573 },
  { src: "/panvel-omni-pedidos-case-06.jpg", width: 1001, height: 1572 },
  { src: "/panvel-omni-pedidos-case-07.jpg", width: 1000, height: 1573 },
  { src: "/panvel-omni-pedidos-case-08.jpg", width: 1001, height: 1572 },
  { src: "/panvel-omni-pedidos-case-09.jpg", width: 1001, height: 1572 },
  { src: "/panvel-omni-pedidos-case-10.jpg", width: 1001, height: 1572 },
];

const panvelOmniPdvProjectImages = Array.from(
  { length: 15 },
  (_, index) => ({
    src: `/panvel-omnipdv-case-${String(index + 1).padStart(2, "0")}.png`,
    width: 1106,
    height: 1420,
  }),
);

const projectDetails = {
  rennerProject: {
    title: "Lojas Renner - App Reposição",
    subtitle: "Vendas e Estoque em sintonia",
    year: "2015 / 2026 - AI Redesign",
    description:
      "A comunicação fragmentada entre o salão de vendas e o estoque dificultava o acompanhamento das solicitações, aumentava o tempo de espera e comprometia a disponibilidade dos produtos para o cliente. O Reposição conecta as duas equipes em uma única jornada. Pelo app, é possível solicitar produtos por meio da leitura do código de barras, acompanhar a separação em tempo real e registrar atendimentos completos ou parciais, com status e notificações claros em cada etapa. O aplicativo foi totalmente redesenhado com o apoio do ChatGPT, desde a revisão dos fluxos e do design system até a implementação da experiência. Desenvolvido com React Native, Expo e TypeScript, utiliza recursos como câmera, animações Lottie e componentes SVG, com execução em iOS, Android e Web, versionamento no GitHub e publicação na Vercel.",
    images: rennerProjectImages,
    imageAlt: "Lojas Renner App Reposição",
  },
  sicrediProject: {
    title: "Sicredi Previdência - Portabilidade Multifundos",
    subtitle:
      "Transformar uma operação complexa em uma jornada clara, segura e guiada.",
    year: "2025 a 2026",
    description:
      "Esse foi o principal desafio do projeto de Portabilidade Multifundos no Portal da Agência Sicredi. A funcionalidade foi desenhada para apoiar o gerente de conta na transferência de planos de previdência entre instituições, organizando etapas como identificação do associado, processos SUSEP, certificados, tributação, fundos de origem e destino, conferência e assinatura. O resultado foi uma jornada web mais estruturada, rastreável e segura, com foco em: redução de dúvidas durante o atendimento; maior controle sobre cada etapa do processo; mais clareza para o gerente e para o associado; consistência visual e operacional com o design system. Além da Portabilidade Multifundos, o Portal da Agência também evoluiu com novas jornadas de previdência: Consultar Solicitações, Nova Contratação, novos métodos de pagamento, Resgate, Informe de Rendimentos, Aporte, Consultar Planos, Portabilidade interna e extrato.",
    images: sicrediProjectImages,
    imageAlt: "Sicredi Previdência Portabilidade Multifundos",
  },
  panvelPdvMovelProject: {
    title: "PanVel - PDV móvel",
    subtitle: "Checkout móvel para agilizar o atendimento nas lojas físicas",
    year: "2025",
    description:
      "Participei da criação do PDV Móvel do Grupo PanVel, uma solução desenvolvida para otimizar a experiência de compra nas lojas físicas e aumentar a eficiência operacional em horários de pico. O projeto permitiu que colaboradores realizassem vendas diretamente no salão da loja utilizando dispositivos móveis capazes de escanear códigos de barras, consultar produtos e processar pagamentos de forma rápida e integrada. A iniciativa teve como foco reduzir filas, agilizar o atendimento e oferecer uma experiência de compra mais fluida e conveniente para os clientes, fortalecendo a estratégia omnichannel e a transformação digital do varejo farmacêutico. Minha atuação envolveu UX/UI, definição de fluxos operacionais, testes com usuários, validação da solução em pilotos com filiais selecionadas e evolução contínua da experiência do produto.",
    images: panvelPdvMovelProjectImages,
    imageAlt: "PanVel PDV móvel",
  },
  panvelSelfCheckoutProject: {
    title: "PanVel - Self-checkout",
    subtitle: "Uma experiência de compra mais rápida, autônoma e assistida",
    year: "2024 a 2025",
    description:
      "Participei da criação do projeto piloto de Self-checkout do Grupo PanVel, uma iniciativa de inovação voltada à transformação da experiência de compra nas lojas físicas. A solução permite que clientes realizem todo o processo de autoatendimento de forma simples e ágil, desde o escaneamento dos produtos até o pagamento diretamente no terminal, utilizando cartão de crédito, débito ou Pix. O projeto foi concebido para otimizar jornadas de compras rápidas, aumentar a autonomia do cliente e reduzir atritos e tempo de espera no processo de pagamento, fortalecendo a estratégia omnichannel e a modernização da experiência no varejo farmacêutico. A atuação envolveu experiência do usuário, fluxos de autoatendimento e integração entre operação física.",
    images: panvelSelfCheckoutProjectImages,
    imageAlt: "PanVel Self-checkout",
  },
  panvelOmniPedidosProject: {
    title: "PanVel - App omniPedidos",
    subtitle: "App mobile para a separação e retirada de pedidos online",
    year: "2022 a 2025",
    description:
      "O App Clique e Retire - omniPedidos foi desenvolvido para digitalizar e otimizar o processo de separação e retirada de pedidos online nas lojas PanVel, eliminando a necessidade de impressão de papel e fortalecendo iniciativas ESG da companhia. A solução reduziu mais de 1 milhão de impressões anuais relacionadas ao processo, além de aumentar a eficiência operacional das equipes de loja por meio de uma jornada totalmente digital, com atualização de pedidos em tempo real, controle de status e gestão integrada da operação. O projeto nasceu no PanVel Labs como uma iniciativa de inovação e transformação digital no varejo farmacêutico, envolvendo discovery, prototipação, validação em lojas piloto e evolução contínua da experiência do usuário, sempre com foco em omnichannel, produtividade operacional e melhoria da experiência dos colaboradores e clientes.",
    images: panvelOmniPedidosProjectImages,
    imageAlt: "PanVel App omniPedidos",
  },
  panvelOmniPdvProject: {
    title: "PanVel - omniPDV",
    subtitle: "Sistema de ponto de venda omnichannel do Grupo PanVel",
    year: "2016 a 2025",
    description:
      "Realizei a concepção, criação e evolução do omniPDV, novo sistema de ponto de venda (POS) do Grupo PanVel integrado ao ecossistema omniPharma. A solução foi projetada para web e tablets com foco em otimizar processos de venda, busca e transação de produtos, medicamentos e serviços nas lojas físicas. Com foco em experiência do usuário, omnichannel e eficiência operacional, o omniPDV contribuiu para aumentar a produtividade dos operadores de loja, padronizar fluxos de atendimento e melhorar a jornada de compra dos clientes no varejo farmacêutico.",
    images: panvelOmniPdvProjectImages,
    imageAlt: "PanVel omniPDV",
  },
};

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
  const projectContentRef = useRef<HTMLElement>(null);
  const isAbout = initialView === "about";
  const isWorks = initialView === "works";
  const isProject =
    initialView === "rennerProject" ||
    initialView === "sicrediProject" ||
    initialView === "panvelPdvMovelProject" ||
    initialView === "panvelSelfCheckoutProject" ||
    initialView === "panvelOmniPedidosProject" ||
    initialView === "panvelOmniPdvProject";
  const activeProject =
    initialView === "sicrediProject"
      ? projectDetails.sicrediProject
      : initialView === "panvelPdvMovelProject"
        ? projectDetails.panvelPdvMovelProject
        : initialView === "panvelSelfCheckoutProject"
          ? projectDetails.panvelSelfCheckoutProject
          : initialView === "panvelOmniPedidosProject"
            ? projectDetails.panvelOmniPedidosProject
            : initialView === "panvelOmniPdvProject"
              ? projectDetails.panvelOmniPdvProject
              : projectDetails.rennerProject;

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/sobre");
    router.prefetch("/trabalhos");
    router.prefetch("/trabalhos/lojas-renner-app-reposicao");
    router.prefetch("/trabalhos/sicredi-portabilidade-multifundos");
    router.prefetch("/trabalhos/panvel-pdv-movel");
    router.prefetch("/trabalhos/panvel-self-checkout");
    router.prefetch("/trabalhos/panvel-app-omni-pedidos");
    router.prefetch("/trabalhos/panvel-omnipdv");
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
      }${isProject ? " project-screen" : ""}${
        isLeavingAbout ? " is-leaving-about" : ""
      }${isLeavingWorks ? " is-leaving-works" : ""}${
        isAwardsOpen ? " is-awards-open" : ""
      }`}
      id="inicio"
    >
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>

      {!isAbout && !isWorks && !isProject && (
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
            if (
              isProject ||
              (!isAbout && !isWorks && !isProject) ||
              isLeavingAbout ||
              isLeavingWorks
            ) {
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
          className={`edge-link edge-link-left${
            isWorks || isProject ? " is-active" : ""
          }`}
          href="/trabalhos"
          aria-current={isWorks || isProject ? "page" : undefined}
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
          <SkeletonImage
            containerClassName="about-photo"
            src="/vicente-bortolini-perfil.jpeg"
            alt=""
            fill
            priority
            unoptimized
            sizes="(max-width: 760px) 100vw, 50vw"
            decorative
          />

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
                  {selectedWork === index &&
                    (work.projectHref ? (
                      <a
                        className="awards-link work-project-link"
                        href={work.projectHref}
                      >
                        Visualizar projeto
                      </a>
                    ) : (
                      <button
                        className="awards-link work-project-link"
                        type="button"
                      >
                        Visualizar projeto
                      </button>
                    ))}
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

          <SkeletonImage
            key={selectedWorks[selectedWork].image}
            containerClassName="works-preview has-cover"
            containerAriaLabel={`Imagem do projeto ${selectedWorks[selectedWork].title}`}
            imageClassName="works-preview-image"
            src={selectedWorks[selectedWork].image}
            alt=""
            fill
            priority={selectedWork === 0}
            quality={72}
            sizes="50vw"
          />
        </section>
      ) : isProject ? (
        <section
          ref={projectContentRef}
          className="project-content"
          id="conteudo"
          aria-labelledby="project-title"
        >
          <header className="project-intro" id="project-top">
            <h1 id="project-title">{activeProject.title}</h1>
            <p className="project-subtitle">{activeProject.subtitle}</p>
            <p className="project-year">{activeProject.year}</p>
            <p className="project-description">{activeProject.description}</p>
          </header>

          <div className="project-gallery" aria-label="Imagens do projeto">
            {activeProject.images.map((image, index) => (
              <SkeletonImage
                containerClassName="project-gallery-item"
                containerStyle={{
                  aspectRatio: `${image.width} / ${image.height}`,
                }}
                imageClassName="project-gallery-image"
                key={image.src}
                src={image.src}
                alt={`${activeProject.imageAlt} — imagem ${index + 1} de ${activeProject.images.length}`}
                width={image.width}
                height={image.height}
                sizes="(max-width: 760px) calc(100vw - 7.1rem), (max-width: 1366px) 80vw, 78rem"
                quality={76}
                priority={index === 0}
              />
            ))}
          </div>

          <div className="project-footer">
            <a
              className="project-back-to-top"
              href="#conteudo"
              onClick={(event) => {
                event.preventDefault();
                projectContentRef.current?.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
                window.history.replaceState(
                  null,
                  "",
                  window.location.pathname,
                );
              }}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                focusable="false"
              >
                <path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" />
              </svg>
              <span>Voltar ao topo</span>
            </a>
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
