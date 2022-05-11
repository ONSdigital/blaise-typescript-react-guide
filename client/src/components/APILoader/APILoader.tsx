import React, { ReactElement, ReactNode } from 'react';
import { ResponseState, useAPIGetRequest } from '../../hooks';

interface APILoaderProps {
  path: string;
  cssName: string
  renderLoading: ReactNode;
  renderError: (error: string) => ReactNode;
  children: (surveys: string[]) => ReactNode;
}

export default function APILoader({
  path,
  cssName,
  renderLoading,
  renderError,
  children,
}: APILoaderProps): ReactElement {
  const response = useAPIGetRequest<string[]>(path);

  function render(): ReactNode {
    switch (response.state) {
      case ResponseState.LOADED:
        return <div className={`${cssName}__loaded`}>{children(response.data)}</div>;
      case ResponseState.ERROR:
        return <div className={`${cssName}__error`}>{renderError(response.error)}</div>;
      case ResponseState.LOADING:
      default:
        return <div className={`${cssName}__loading`}>{renderLoading}</div>;
    }
  }

  return <div className={cssName}>{render()}</div>;
}
