import React, { ReactElement, ReactNode } from 'react';
import APILoader from '../APILoader';

interface SurveyLoaderProps {
  renderLoading: ReactNode;
  renderError: (error: string) => ReactNode;
  children: (surveys: string[]) => ReactNode;
}

export default function SurveyLoader({
  renderLoading,
  renderError,
  children,
}: SurveyLoaderProps): ReactElement {
  return (
    <APILoader
      path="/surveys"
      cssName="survey-loader"
      renderLoading={renderLoading}
      renderError={renderError}
    >
      {children}
    </APILoader>
  );
}
