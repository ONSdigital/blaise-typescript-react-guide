import React, { ReactElement, ReactNode } from 'react';
import { ResponseState, useAPIGetRequest } from '../../hooks';
import APILoader from '../APILoader/APILoader';

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
