import React from 'react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
  limit?: number;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ onSelect, limit = 4 }) => {
  const { userCategory, language, userProfile } = useApp();

  const isFr = language === 'fr';
  const isEnrolled = userCategory === 'enrolled';

  const prospectiveQuestions = isFr
    ? [
        'Quels programmes sont proposés ?',
        'Combien coûtent les frais de scolarité ?',
        'Quelle est la date limite de candidature ?',
        'Quelles sont les conditions d’admission ?',
        'Quels documents dois-je fournir pour postuler ?',
        'Combien d’années dure la Licence en Informatique ?'
      ]
    : [
        'What programs are offered?',
        'How much are school fees?',
        'When is the application deadline?',
        'What are the admission requirements?',
        'What documents do I need to apply?',
        'How long does a Computer Science degree take?'
      ];

  const enrolledQuestions = isFr
    ? [
        `Combien de crédits puis-je inscrire ce semestre ?`,
        'Quand est la date limite des frais de scolarité ?',
        'Comment enregistrer mes cours (Form A/B) ?',
        'Quelles sont les dates des examens du 1er semestre ?',
        'Que se passe-t-il si j’échoue à une matière ?',
        'Quelles sont les règles des crédits supplémentaires ?'
      ]
    : [
        `How many credits can I register for this semester?`,
        'When is school fee payment due?',
        'How do I register my courses?',
        'What are the semester exam dates?',
        'What happens if I fail a course?',
        'Are additional credits permitted, and under what conditions?'
      ];

  const questions = isEnrolled ? enrolledQuestions : prospectiveQuestions;
  const displayQuestions = questions.slice(0, limit);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#17233B]">
          <Sparkles className="w-3.5 h-3.5 text-[#1463F3]" />
          <span>{isFr ? 'Questions fréquentes' : 'Popular questions'}</span>
        </div>
        <span className="text-[11px] text-[#68758B]">
          {isEnrolled ? (userProfile?.department || 'Personalized') : 'Explore'}
        </span>
      </div>

      <div className="space-y-2">
        {displayQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(q)}
            className="w-full text-left px-3.5 py-2.5 rounded-xl bg-white border border-[#E1E8F2] hover:border-blue-300 hover:bg-[#EEF5FF]/60 text-xs text-[#17233B] font-medium transition-all flex items-center justify-between group shadow-2xs"
          >
            <span className="group-hover:text-[#1463F3] transition-colors leading-relaxed">
              • {q}
            </span>
            <span className="text-[#68758B] group-hover:text-[#1463F3] text-xs transition-colors shrink-0 ml-2">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
