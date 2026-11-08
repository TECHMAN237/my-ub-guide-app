import React, { useEffect, useRef, useState } from "react";
import { BookOpen, FileCheck2, GraduationCap, Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";

export const CompassJourney: React.FC<{ isFr: boolean }> = ({ isFr }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reducedMotion || failed) return;
    const syncPlayback = (visible: boolean) => {
      if (visible && !document.hidden && !paused) {
        void video.play().catch(() => setPaused(true));
      } else video.pause();
    };
    let visible = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        syncPlayback(visible);
      },
      { threshold: 0.1 },
    );
    if (containerRef.current) observer.observe(containerRef.current);
    const onVisibility = () => syncPlayback(visible);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      video.pause();
    };
  }, [paused, reducedMotion, failed]);

  return (
    <div
      ref={containerRef}
      className="journey-visual"
      role="group"
      aria-label={
        isFr
          ? "Votre parcours : programme, candidature, vie étudiante"
          : "Your journey: programme, application, student life"
      }
    >
      <img
        className="journey-still"
        src="/assets/compass-journey.svg"
        alt=""
        width="720"
        height="760"
      />
      {reducedMotion === false && !failed && (
        <video
          ref={videoRef}
          width="720"
          height="760"
          muted
          loop
          playsInline
          preload="none"
          poster="/assets/compass-journey.svg"
          aria-hidden="true"
          onError={() => setFailed(true)}
        >
          <source src="/assets/compass-journey.mp4" type="video/mp4" />
        </video>
      )}
      <span className="journey-label journey-label-one">
        <BookOpen size={16} aria-hidden="true" />
        {isFr ? "Trouvez votre voie" : "Find your programme"}
      </span>
      <span className="journey-label journey-label-two">
        <FileCheck2 size={16} aria-hidden="true" />
        {isFr ? "Préparez la suite" : "Take your next step"}
      </span>
      <span className="journey-label journey-label-three">
        <GraduationCap size={16} aria-hidden="true" />
        {isFr ? "Prenez vos repères" : "Make yourself at home"}
      </span>
      <div className="journey-caption">
        <strong>{isFr ? "Gardez le cap." : "A little direction."}</strong>
        <span>Buea, Cameroon</span>
      </div>
      {reducedMotion === false && !failed && (
        <button
          className="journey-toggle"
          type="button"
          onClick={() => setPaused((value) => !value)}
          aria-label={
            paused
              ? isFr
                ? "Lire l’animation"
                : "Play animation"
              : isFr
                ? "Mettre l’animation en pause"
                : "Pause animation"
          }
          aria-pressed={paused}
        >
          {paused ? (
            <Play size={16} aria-hidden="true" />
          ) : (
            <Pause size={16} aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
};
