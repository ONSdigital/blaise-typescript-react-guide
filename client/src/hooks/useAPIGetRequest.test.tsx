import React, { ReactElement } from 'react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { render, screen } from '@testing-library/react';
import APIContext from '../components/APIContext';
import { useAPIGetRequest } from './index';
import { ResponseState } from './useAPIGetRequest';

function TestComponent(): ReactElement {
  const response = useAPIGetRequest<string[]>('/resources');

  switch (response.state) {
    case ResponseState.LOADED:
      return (
        <>
          Data:
          {response.data.join(',')}
        </>
      );
    case ResponseState.ERROR:
      return (
        <>
          Failed:
          {response.error}
        </>
      );
    case ResponseState.LOADING:
    default:
      return <>Loading</>;
  }
}

describe('useAPIGetRequest', () => {
  const mock = new MockAdapter(axios);
  const config = { endpoint: 'https://example.com/api/v1' };

  function renderTestComponent() {
    return render(
      <APIContext.Provider value={config}>
        <TestComponent />
      </APIContext.Provider>,
    );
  }

  it('returns the loading state while waiting', () => {
    mock.onGet(
      'https://example.com/api/v1/resources',
      () => new Promise(() => { /* never resolve */ }),
    );

    renderTestComponent();

    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('returns the data when loaded', async () => {
    mock.onGet('https://example.com/api/v1/resources')
      .reply(200, ['SURVEY1', 'SURVEY2']);

    renderTestComponent();

    expect(await screen.findByText(/SURVEY1/)).toBeInTheDocument();
    expect(await screen.findByText(/SURVEY2/)).toBeInTheDocument();
  });

  it('displays HTTP errors', async () => {
    mock.onGet('https://example.com/api/v1/resources')
      .reply(500, 'error occurred');

    renderTestComponent();

    expect(await screen.findByText(/Failed.*Error: Request failed with status code 500/)).toBeInTheDocument();
  });

  it('displays non-HTTP errors', async () => {
    mock.onGet('https://example.com/api/v1/resources')
      .reply(() => { throw new Error('error message'); });

    renderTestComponent();

    expect(await screen.findByText(/Failed:.*Error: error message/)).toBeInTheDocument();
  });
});
