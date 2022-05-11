import React, { ReactElement } from 'react';
import SurveyLoader from '../SurveyLoader';
import LoadingSpinner from '../LoadingSpinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MultipleChoice from '../MultipleChoice';

interface SurveySelectorProps {
  onUpdate: (selected: string[]) => void
}

export default function SurveySelector({ onUpdate }: SurveySelectorProps): ReactElement {
  return (
    <div>
      <SurveyLoader
        renderLoading={<LoadingSpinner />}
        renderError={(error) => <ErrorMessage message={error} />}
      >
        {(surveys) => <MultipleChoice question="Which surveys are your favourite?" values={surveys} onUpdate={onUpdate} />}
      </SurveyLoader>
    </div>
  );
}
