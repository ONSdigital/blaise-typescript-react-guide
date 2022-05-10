import React, { ReactElement } from 'react';

interface ErrorMessageProps {
  message: string
}

export default function ErrorMessage({ message }: ErrorMessageProps): ReactElement {
  return (
    <div className="error-message">
      <div className="error-message__title">Error:</div>
      <div className="error-message__message">{message}</div>
    </div>
  );
}
