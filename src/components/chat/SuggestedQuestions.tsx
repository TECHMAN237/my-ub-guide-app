import React from 'react';
import { useApp } from '../../context/AppContext';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  limit?: number;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelect, limit = 4 }) => {
  const { userCategory, language } = useApp();

  const isFr = language === 'fr';
  const isEnrolled = userCategory === 'enrolled';

  const prospectiveQuestions = isFr
    ? [
        'Quels programmes sont proposés ?',
        'Combien coûtent les frais de scolarité ?',
        'Quelle est la date limite de candidature ?',
        'Quelles sont les conditions d’admission ?',
        'Quels documents dois-je fournir pour postuler ?',
        'Combien d’années dure la Licence en Informatique ?',
      ]
    : [
        'What programmes are offered?',
        'How much are school fees?',
        'When is the application deadline?',
        'What are the admission requirements?',
        'What documents do I need to apply?',
        'How long does a Computer Science degree take?',
      ];

  const enrolledQuestions = isFr
    ? [
        'Combien de crédits puis-je inscrire ce semestre ?',
        'Quand est la date limite des frais de scolarité ?',
        'Comment enregistrer mes cours (Form A/B) ?',
        'Quelles sont les dates des examens du 1er semestre ?',
        'Que se passe-t-il si j’échoue à une matière ?',
        'Quelles sont les règles des crédits supplémentaires ?',
      ]
    : [
        'How many credits can I register for this semester?',
        'When is school fee payment due?',
        'How do I register my courses?',
        'What are the semester exam dates?',
        'What happens if I fail a course?',
        'Are additional credits permitted, and under what conditions?',
      ];

  const questions = isEnrolled ? enrolledQuestions : prospectiveQuestions;
  const displayQuestions = questions.slice(0, limit);

  return (
    <div className="w-full">
      <p className="mb-1 text-[14px] text-muted">
        {isFr ? 'Questions fréquentes' : 'Common questions'}
      </p>
      <div className="flex flex-wrap gap-x-5">
        {displayQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(q)}
            className="min-h-[44px] max-w-full text-left text-[16px] font-medium text-accent underline-offset-2 transition-colors hover:underline"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};
