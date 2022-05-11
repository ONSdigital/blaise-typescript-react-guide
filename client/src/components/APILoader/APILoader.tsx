import React, { ReactElement, ReactNode } from 'react';
import { ResponseState, useAPIGetRequest } from '../../hooks';

interface APILoaderProps {
  path: string;
  cssName: string
  loadingMessage: ReactNode;
  errorMessage: (error: string) => ReactNode;
  children: (surveys: string[]) => ReactNode;
}

export default function APILoader({
  path,
  cssName,
  loadingMessage,
  errorMessage,
  children,
}: APILoaderProps): ReactElement {
  const response = useAPIGetRequest<string[]>(path);

  function render(): ReactNode {
    switch (response.state) {
      case ResponseState.LOADED:
        return <div className={`${cssName}__loaded`}>{children(response.data)}</div>;
      case ResponseState.ERROR:
        return <div className={`${cssName}__error`}>{errorMessage(response.error)}</div>;
      case ResponseState.LOADING:
      default:
        return <div className={`${cssName}__loading`}>{loadingMessage}</div>;
    }
  }

  return <div className={cssName}>{render()}</div>;
}
