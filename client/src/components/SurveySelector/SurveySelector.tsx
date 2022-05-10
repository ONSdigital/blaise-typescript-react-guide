import React, { ReactElement, ReactNode } from 'react';
import SurveyLoader from '../SurveyLoader';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MultipleChoice from '../MultipleChoice';

interface SurveySelectorProps {
  onUpdate: (selected: string[]) => void
}

export default function SurveySelector({ onUpdate }: SurveySelectorProps): ReactElement {
  function errorMessage(error: string): ReactNode {
    return <ErrorMessage message={error} />;
  }

  return (
    <div>
      <SurveyLoader
        loadingMessage={<LoadingSpinner />}
        errorMessage={(error) => errorMessage(error)}
      >
        {(surveys) => <MultipleChoice question="Which surveys are your favourite?" values={surveys} onUpdate={onUpdate} />}
      </SurveyLoader>
    </div>
  );
}
