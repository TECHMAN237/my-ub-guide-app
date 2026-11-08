import React from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  FileCheck2,
  CalendarDays,
  Check,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { CompassMark } from "../components/layout/AppHeader";
import { CompassJourney } from "../components/common/CompassJourney";
import { Reveal } from "../components/common/Reveal";

export const SplashView: React.FC = () => {
  const { navigateTo, userProfile, loginDemo, language, setLanguage } =
    useApp();
  const isFr = language === "fr";
  const handleGuest = () => {
    if (!userProfile)
      loginDemo("guest@student.uniguide.edu.cm", "Guest Student");
    navigateTo("/home");
  };
  const steps = [
    {
      title: isFr ? "Trouvez votre programme." : "Find a path that fits.",
      description: isFr
        ? "Découvrez les diplômes, les conditions d’admission et les débouchés. Comparez vos options avant de choisir."
        : "Explore degrees, entry requirements and career paths. Compare your options before making a choice.",
      route: "/programs",
    },
    {
      title: isFr
        ? "Préparez la prochaine étape."
        : "Turn a plan into a place.",
      description: isFr
        ? "Documents, candidature, frais : avancez avec une liste claire des étapes à suivre."
        : "Documents, applications, fees. Work through a clear checklist and know what to prepare next.",
      route: "/admissions",
    },
    {
      title: isFr ? "Prenez vos repères." : "Settle into student life.",
      description: isFr
        ? "Retrouvez les dates académiques, les règles et les ressources utiles pour vos études."
        : "Keep academic dates, university rules and useful study resources close at hand.",
      route: "/resources",
    },
  ];
  return (
    <div className="welcome-page bg-ground">
      <header className="welcome-header shell-width">
        <div className="welcome-brand">
          <CompassMark className="h-7 w-7 text-accent" />
          <span>UB Compass</span>
        </div>
        <div className="welcome-header-actions">
          <button
            type="button"
            onClick={() => setLanguage(isFr ? "en" : "fr")}
            aria-label={isFr ? "Passer en anglais" : "Switch to French"}
          >
            {isFr ? "EN" : "FR"}
          </button>
          <button
            type="button"
            onClick={() => navigateTo(userProfile ? "/home" : "/auth/login")}
          >
            {isFr ? "Se connecter" : "Sign in"}{" "}
            <ArrowUpRight
              className="inline ml-1"
              size={15}
              aria-hidden="true"
            />
          </button>
        </div>
      </header>
      <div className="welcome-main shell-width mx-auto">
        <section className="welcome-hero" aria-labelledby="welcome-heading">
          <div className="welcome-copy">
            <p className="context-line">
              {isFr
                ? "Université de Buea · Votre guide étudiant"
                : "University of Buea · Your student companion"}
            </p>
            <h1 id="welcome-heading">
              {isFr ? (
                <>
                  Votre avenir.
                  <br />
                  <span>Un cap clair.</span>
                </>
              ) : (
                <>
                  Your future.
                  <br />
                  <span>A clearer path.</span>
                </>
              )}
            </h1>
            <p className="welcome-lede">
              {isFr
                ? "Du premier choix de programme à la vie sur le campus, trouvez vos repères à l’Université de Buea. Une question à la fois."
                : "From your first programme choice to life on campus, find your way through the University of Buea. One question at a time."}
            </p>
            <div className="welcome-cta">
              <button
                type="button"
                onClick={handleGuest}
                className="btn btn-primary"
              >
                {isFr ? "Continuer en invité" : "Continue as guest"}
                <ArrowRight size={17} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => navigateTo("/auth/signup")}
                className="btn btn-secondary"
              >
                {isFr ? "Créer un compte" : "Create an account"}
              </button>
            </div>
            <p className="welcome-note">
              <Check size={14} aria-hidden="true" />
              {isFr
                ? "Sans compte pour commencer · Français ou anglais"
                : "No account needed to start · English or French"}
            </p>
          </div>
          <CompassJourney isFr={isFr} />
        </section>
        <nav
          className="welcome-topics"
          aria-label={
            isFr ? "Accès rapide à l’université" : "University shortcuts"
          }
        >
          <p>
            {isFr
              ? "L’université, un peu plus simple."
              : "University, a little less complicated."}
          </p>
          <div>
            <button type="button" onClick={() => navigateTo("/programs")}>
              <BookOpen size={16} aria-hidden="true" />
              Programmes
            </button>
            <button type="button" onClick={() => navigateTo("/admissions")}>
              <FileCheck2 size={16} aria-hidden="true" />
              Admissions
            </button>
            <button
              type="button"
              onClick={() => navigateTo("/academic-calendar")}
            >
              <CalendarDays size={16} aria-hidden="true" />
              {isFr ? "Calendrier" : "Academic dates"}
            </button>
          </div>
        </nav>
        <section className="welcome-section" aria-labelledby="guide-heading">
          <Reveal>
            <div className="welcome-section-heading">
              <h2 id="guide-heading">
                {isFr
                  ? "Moins d’incertitude. Plus de repères."
                  : "Less figuring it out. More moving forward."}
              </h2>
              <p>
                {isFr
                  ? "Les informations utiles, réunies pour chaque étape de votre parcours."
                  : "The information you need, brought together for every stage of your university journey."}
              </p>
            </div>
          </Reveal>
          {steps.map((step, index) => (
            <Reveal key={step.route}>
              <button
                className="guide-step"
                type="button"
                onClick={() => navigateTo(step.route)}
              >
                <span className="guide-step-index">0{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <ArrowUpRight size={22} strokeWidth={1.5} aria-hidden="true" />
              </button>
            </Reveal>
          ))}
        </section>
        <Reveal>
          <section className="welcome-close">
            <div>
              <h2>
                {isFr
                  ? "Votre prochaine étape commence ici."
                  : "Your next chapter starts here."}
              </h2>
              <p>
                {isFr
                  ? "Posez votre première question. Nous vous aidons à trouver le cap."
                  : "Ask your first question. We’ll help you find a little direction."}
              </p>
            </div>
            <button
              type="button"
              onClick={handleGuest}
              className="btn btn-primary"
            >
              {isFr ? "Poser une question" : "Ask a question"}
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </section>
        </Reveal>
      </div>
      <footer className="welcome-footer shell-width">
        <span>
          UB Compass ·{" "}
          {isFr
            ? "Votre guide pour l’Université de Buea"
            : "Your guide to the University of Buea"}
        </span>
        <div>
          {[
            { label: isFr ? "À propos" : "About", route: "/about" },
            { label: isFr ? "Confidentialité" : "Privacy", route: "/privacy" },
            { label: isFr ? "Aide" : "Help", route: "/help" },
          ].map((link) => (
            <button
              key={link.route}
              type="button"
              onClick={() => navigateTo(link.route)}
            >
              {link.label}
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
};
