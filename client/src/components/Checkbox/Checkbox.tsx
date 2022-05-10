import React, { ReactElement, useId } from 'react';

interface CheckboxProps {
  label: string
  onChecked: () => void
  onUnchecked: () => void
}

export default function Checkbox({ label, onChecked, onUnchecked }: CheckboxProps): ReactElement {
  const id = useId();

  function onChange(event: React.FormEvent<HTMLInputElement>) {
    if (event.currentTarget.checked) {
      onChecked();
    } else {
      onUnchecked();
    }
  }

  return (
    <div className="checkbox">
      <input className="checkbox__input" id={id} type="checkbox" onChange={onChange} />
      <label className="checkbox__label" htmlFor={id}>{label}</label>
    </div>
  );
}
