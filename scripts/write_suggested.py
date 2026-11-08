"""Write the new SuggestedQuestions.tsx (taste-direction design)."""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.normpath(os.path.join(HERE, '..', 'src', 'components', 'chat', 'SuggestedQuestions.tsx'))

JSX = r'''import React from 'react';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
}

export const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ questions, onSelect }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-2 pl-1">
      {questions.map((q, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelect(q)}
          className="text-xs bg-accent-soft text-accent hover:bg-accent-edge border border-ink/10 rounded-full px-3 py-1.5 font-medium transition-colors text-left cursor-pointer"
        >
          {q}
        </button>
      ))}
    </div>
  );
};
'''

with open(OUT, 'w', encoding='utf-8') as f:
    f.write(JSX)
print('wrote', OUT)
