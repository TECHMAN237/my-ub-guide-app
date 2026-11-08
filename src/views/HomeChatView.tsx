import React, { useRef, useEffect, useMemo } from "react";
import {
  ArrowRight,
  Plus,
  History,
  BookOpen,
  FileCheck2,
  Wallet,
  CalendarDays,
  MessageCircle,
  Check,
  Compass,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { ChatMessageItem } from "../components/chat/ChatMessageItem";
import { ChatComposer } from "../components/chat/ChatComposer";
import { RobotAvatar } from "../components/common/RobotAvatar";

export const HomeChatView: React.FC = () => {
  const {
    userProfile,
    language,
    selectConversation,
    userCategory,
    conversations,
    activeConversation,
    createNewConversation,
    sendMessage,
    isSendingMessage,
    chatError,
    retryLastMessage,
    navigateTo,
    checklist,
    calendarEvents,
  } = useApp();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isFr = language === "fr";
  const isEnrolled = userCategory === "enrolled";

  useEffect(() => {
    if (
      activeConversation?.messages &&
      activeConversation.messages.length > 0
    ) {
      messagesEndRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    }
  }, [activeConversation?.messages, isSendingMessage]);

  const hasMessages = Boolean(
    activeConversation && activeConversation.messages.length > 0,
  );

  const handleQuestionClick = (question: string) => {
    sendMessage(question);
  };

  const recentQuestions = useMemo(() => {
    const asked = conversations
      .flatMap((conversation) => conversation.messages)
      .filter((message) => message.sender === "user")
      .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp))
      .map((message) => message.text);
    const unique = Array.from(new Set(asked));
    return unique.slice(0, 3);
  }, [conversations]);

  const fallbackQuestions = [
    isFr ? "Quels programmes sont proposés ?" : "What programmes are offered?",
    isFr ? "Quels sont les frais de scolarité ?" : "How much are school fees?",
    isFr ? "Comment déposer ma candidature ?" : "How do I apply for admission?",
  ];
  const prompts =
    recentQuestions.length > 0 ? recentQuestions : fallbackQuestions;

  const nextChecklistItem = checklist.find((item) => !item.completed);
  const nextMilestone = [...calendarEvents]
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .find((event) => event.status === "ongoing" || event.status === "upcoming");

  const nextStep = isEnrolled
    ? nextMilestone
      ? {
          label: nextMilestone.title,
          detail: nextMilestone.displayDate,
          route: "/academic-calendar",
        }
      : null
    : nextChecklistItem
      ? {
          label: nextChecklistItem.title,
          detail: nextChecklistItem.description,
          route: "/admissions/checklist",
        }
      : null;

  const links = [
    {
      label: "Programmes",
      detail: isFr ? "Trouvez votre voie" : "Find your field of study",
      route: "/programs",
      icon: BookOpen,
    },
    {
      label: "Admissions",
      detail: isFr ? "Préparez votre candidature" : "Make your next move",
      route: "/admissions",
      icon: FileCheck2,
    },
    {
      label: isFr ? "Frais de scolarité" : "School fees",
      detail: isFr ? "Planifiez votre budget" : "Plan your university budget",
      route: "/fees",
      icon: Wallet,
    },
    {
      label: isFr ? "Calendrier" : "Academic calendar",
      detail: isFr ? "Gardez les dates en vue" : "Keep important dates in view",
      route: "/academic-calendar",
      icon: CalendarDays,
    },
  ];
  const completed = checklist.filter((item) => item.completed).length;
  const progress = checklist.length
    ? Math.round((completed / checklist.length) * 100)
    : 0;
  const recentConversations = [...conversations]
    .filter((c) => c.messages.length > 0)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 3);
  const firstName = userProfile?.name?.split(" ")[0];
  const isGuest =
    !userProfile || userProfile.email === "guest@student.uniguide.edu.cm";

  if (hasMessages) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[760px] flex-col px-5 pb-28 sm:px-8 md:pb-10">
        <div className="flex items-center justify-between gap-4 border-b border-rule py-3">
          <h1 className="min-w-0 truncate text-[18px] font-semibold text-ink">
            {activeConversation?.title || "Conversation"}
          </h1>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => navigateTo("/history")}
              className="flex h-11 w-11 items-center justify-center rounded-[10px] text-muted transition-colors hover:bg-raised hover:text-ink"
              aria-label="Conversation history"
            >
              <History className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={createNewConversation}
              className="flex h-11 items-center gap-1.5 rounded-[10px] px-3 text-[14px] font-medium text-ink transition-colors hover:bg-raised"
            >
              <Plus className="h-4 w-4" />
              New
            </button>
          </div>
        </div>

        <div className="flex-1 py-5">
          {activeConversation?.messages.map((msg) => (
            <ChatMessageItem
              key={msg.id}
              message={msg}
              onSelectFollowUp={handleQuestionClick}
            />
          ))}

          {isSendingMessage && (
            <div className="mb-5 flex items-center gap-3">
              <RobotAvatar size="sm" />
              <span className="flex items-center gap-2 text-[14px] text-muted">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                Checking the university knowledge base…
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="sticky bottom-20 bg-ground pt-2 md:bottom-0">
          <ChatComposer
            onSendMessage={sendMessage}
            isSending={isSendingMessage}
            error={chatError}
            onRetry={retryLastMessage}
            placeholder={
              isEnrolled
                ? "Ask about credits, exams or registration…"
                : "Ask about programmes, fees or admissions…"
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="home-page shell-width mx-auto pb-28 md:pb-16">
      <div className="home-heading">
        <div>
          <p className="context-line">
            {isFr ? "Votre guide étudiant" : "Your student companion"}
          </p>
          <h1>
            {isGuest
              ? isFr
                ? "Trouvez votre voie à UB."
                : "Find your way at UB."
              : isFr
                ? `À vos côtés, ${firstName}.`
                : `A little direction, ${firstName}.`}
          </h1>
          <p className="page-lede mt-2">
            {isFr
              ? "Une question, une candidature, une prochaine étape. On commence ici."
              : "A question, an application, a next step. It starts here."}
          </p>
        </div>
        <button
          type="button"
          className="home-profile"
          onClick={() => navigateTo("/profile")}
          aria-label={isFr ? "Ouvrir votre profil" : "Open your profile"}
        >
          <span className="profile-monogram">
            {isGuest ? "G" : firstName?.charAt(0)}
          </span>
          <span>
            {isGuest
              ? isFr
                ? "Espace invité"
                : "Guest workspace"
              : isFr
                ? "Mon espace"
                : "My workspace"}
          </span>
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </div>

      <div className="home-main-grid">
        <section
          className="assistant-panel"
          aria-labelledby="assistant-heading"
        >
          <div className="section-kicker">
            <Compass size={18} aria-hidden="true" />
            <span>UB Compass</span>
            <span className="assistant-language">English / Français</span>
          </div>
          <h2 id="assistant-heading">
            {isFr ? "Une question sur UB ?" : "University questions?"}
            <br />
            <span>{isFr ? "Parlons-en." : "Let’s figure it out."}</span>
          </h2>
          <p>
            {isFr
              ? "Programmes, frais ou vie académique : posez votre question, à l’écrit ou à la voix."
              : "From choosing a degree to understanding fees. Ask in your own words, or use your voice."}
          </p>
          <ChatComposer
            onSendMessage={sendMessage}
            isSending={isSendingMessage}
            error={chatError}
            onRetry={retryLastMessage}
            placeholder={
              isFr
                ? "Que souhaitez-vous savoir ?"
                : "What would you like to know?"
            }
          />
          <div className="assistant-footnote">
            <span className="status-dot" />
            {isFr
              ? "Réponses basées sur les informations de l’université"
              : "Grounded in university information"}
          </div>
        </section>

        <section className="next-step-panel" aria-labelledby="next-heading">
          <div className="section-kicker">
            <span>
              {isEnrolled
                ? isFr
                  ? "Vie académique"
                  : "Your academic life"
                : isFr
                  ? "Votre candidature"
                  : "Your application"}
            </span>
            <FileCheck2 size={18} aria-hidden="true" />
          </div>
          <h2 id="next-heading">
            {nextStep
              ? isFr
                ? "Une étape à la fois."
                : "One step at a time."
              : isFr
                ? "Vous êtes à jour."
                : "You’re all caught up."}
          </h2>
          {!isEnrolled && checklist.length > 0 && (
            <div className="application-progress">
              <div>
                <span>{isFr ? "Votre progression" : "Your progress"}</span>
                <span>
                  {completed} / {checklist.length}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={
                  isFr
                    ? "Progression de la candidature"
                    : "Application progress"
                }
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                className="bar-track"
              >
                <div className="bar-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
          <div className="next-step-body">
            <p className="next-step-title">
              {nextStep?.label ||
                (isFr ? "Préparez la suite" : "Make room for what’s next")}
            </p>
            <p>
              {nextStep?.detail ||
                (isFr
                  ? "Consultez le calendrier pour préparer votre prochaine étape."
                  : "Check the academic calendar and plan ahead.")}
            </p>
          </div>
          <button
            type="button"
            className="next-step-action"
            onClick={() => navigateTo(nextStep?.route || "/academic-calendar")}
          >
            {isFr ? "Voir la suite" : "See my next step"}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </section>
      </div>

      <section className="explore-section" aria-labelledby="explore-heading">
        <div className="section-heading">
          <h2 id="explore-heading">
            {isFr ? "Explorez l’université" : "Get to know your university"}
          </h2>
          <span>
            {isFr
              ? "L’essentiel, à portée de main"
              : "The essentials, all in one place"}
          </span>
        </div>
        <nav
          className="explore-grid"
          aria-label={isFr ? "Explorer l’université" : "Browse the university"}
        >
          {links.map(({ label, detail, route, icon: Icon }) => (
            <button
              type="button"
              key={route}
              onClick={() => navigateTo(route)}
              className="explore-link"
            >
              <div>
                <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                <ArrowRight size={16} aria-hidden="true" />
              </div>
              <h3>{label}</h3>
              <p>{detail}</p>
            </button>
          ))}
        </nav>
      </section>

      <div className="home-secondary-grid">
        <section className="questions-panel" aria-labelledby="recent-questions">
          <div className="section-heading">
            <h2 id="recent-questions">
              {recentQuestions.length
                ? isFr
                  ? "Vos questions récentes"
                  : "Pick up a question"
                : isFr
                  ? "Un point de départ"
                  : "A good place to start"}
            </h2>
            <MessageCircle size={18} aria-hidden="true" />
          </div>
          {prompts.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => handleQuestionClick(question)}
              disabled={isSendingMessage}
              className="question-row"
            >
              <span>{question}</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          ))}
        </section>
        <section
          className="recent-panel"
          aria-labelledby="conversations-heading"
        >
          <div className="section-heading">
            <h2 id="conversations-heading">
              {isFr ? "Vos discussions" : "Your conversations"}
            </h2>
            <button
              className="text-action"
              type="button"
              onClick={() => navigateTo("/history")}
            >
              {isFr ? "Tout voir" : "View all"}
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
          {recentConversations.length ? (
            recentConversations.map((conversation) => (
              <button
                className="question-row"
                type="button"
                key={conversation.id}
                onClick={() => {
                  selectConversation(conversation.id);
                  navigateTo("/chat");
                }}
              >
                <span>{conversation.title}</span>
                <ArrowRight size={16} aria-hidden="true" />
              </button>
            ))
          ) : (
            <div className="empty-conversations">
              <History size={24} strokeWidth={1.4} aria-hidden="true" />
              <p>
                {isFr
                  ? "Votre prochaine idée commence par une question."
                  : "Your next idea starts with a question."}
              </p>
              <span>
                {isFr
                  ? "Vos discussions apparaîtront ici."
                  : "Your conversations will find a home here."}
              </span>
            </div>
          )}
        </section>
      </div>
      <p className="home-bottom-note">
        <Check size={14} aria-hidden="true" />
        {isFr
          ? "Pour les décisions importantes, vérifiez toujours les sources officielles de l’UB."
          : "Making an important decision? Always confirm with UB’s official sources."}
      </p>
    </div>
  );
};
