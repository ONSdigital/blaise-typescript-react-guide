import React, { useEffect, useState } from 'react';
import Checkbox from '../Checkbox';

interface MultipleChoiceProps {
  question: string
  values: string[]
  onUpdate: (items: string[]) => void
}

export default function MultipleChoice({ question, values, onUpdate }: MultipleChoiceProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    onUpdate(selected);
  }, [onUpdate, selected]);

  function selectValue(value: string) {
    setSelected((current) => [...current, value]);
  }

  function unselectValue(value: string) {
    setSelected((current) => current.filter((item) => item !== value));
  }

  return (
    <div className="multiple-choice">
      <div className="multiple-choice__question">{question}</div>
      <div className="multiple-choice__options">
        {values.map((value) => (
          <Checkbox
            key={value}
            label={value}
            onChecked={() => selectValue(value)}
            onUnchecked={() => unselectValue(value)}
          />
        ))}
      </div>
    </div>
  );
}
