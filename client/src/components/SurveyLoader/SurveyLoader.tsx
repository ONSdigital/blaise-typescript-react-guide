import React, { ReactElement, ReactNode } from 'react';
import { ResponseState, useAPIGetRequest } from '../../hooks';
import APILoader from '../APILoader/APILoader';

interface SurveyLoaderProps {
  loadingMessage: ReactNode;
  errorMessage: (error: string) => ReactNode;
  children: (surveys: string[]) => ReactNode;
}

export default function SurveyLoader({
  loadingMessage,
  errorMessage,
  children,
}: SurveyLoaderProps): ReactElement {
  const response = useAPIGetRequest<string[]>('/surveys');

  function render(): ReactNode {
    switch (response.state) {
      case ResponseState.LOADED:
        return <div className="survey-loader__loaded">{children(response.data)}</div>;
      case ResponseState.ERROR:
        return <div className="survey-loader__error">{errorMessage(response.error)}</div>;
      case ResponseState.LOADING:
      default:
        return <div className="survey-loader__loading">{loadingMessage}</div>;
    }
  }

  return (
    <APILoader
      path="/surveys"
      cssName="survey-loader"
      loadingMessage={loadingMessage}
      errorMessage={errorMessage}
    >
      {children}
    </APILoader>
  );
}
