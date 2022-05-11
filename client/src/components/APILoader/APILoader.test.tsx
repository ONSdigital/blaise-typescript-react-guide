import React from 'react';
import { render, RenderResult, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import APIContext from '../APIContext';
import APILoader from './APILoader';

describe('APILoader', () => {
  const mock = new MockAdapter(axios);
  const config = { endpoint: 'https://example.com/api/v1' };

  let wrapper: RenderResult;

  function renderAPILoader() {
    return render(
      <APIContext.Provider value={config}>
        <APILoader
          loadingMessage="Loading Message"
          errorMessage={(error) => `Failed: ${error}`}
          path="/surveys"
          cssName="survey-loader"
        >
          {(surveys) => surveys.map((survey) => <div key={survey}>{survey}</div>)}
        </APILoader>
      </APIContext.Provider>,
    );
  }

  describe('when waiting for the response', () => {
    beforeEach(() => {
      mock.onGet('https://example.com/api/v1/surveys')
        .reply(() => new Promise(() => { /* never resolve */ }));

      wrapper = renderAPILoader();
    });

    it('displays the loading message', () => {
      expect(screen.getByText('Loading Message')).toBeInTheDocument();
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when request is successful', () => {
    beforeEach(() => {
      mock.onGet('https://example.com/api/v1/surveys')
        .reply(200, ['SURVEY1', 'SURVEY2']);

      wrapper = renderAPILoader();
    });

    it('renders children with surveys', async () => {
      expect(await screen.findByText('SURVEY1')).toBeInTheDocument();
      expect(await screen.findByText('SURVEY2')).toBeInTheDocument();
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when HTTP error is returned', () => {
    beforeEach(() => {
      mock.onGet('https://example.com/api/v1/surveys')
        .reply(500, 'error occurred');

      renderAPILoader();
    });

    it('displays HTTP errors', async () => {
      expect(await screen.findByText('Failed: Error: Request failed with status code 500')).toBeInTheDocument();
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when error is thrown', () => {
    beforeEach(() => {
      mock.onGet('https://example.com/api/v1/surveys')
        .reply(() => {
          throw new Error('error message');
        });

      renderAPILoader();
    });

    it('displays non-HTTP errors', async () => {
      expect(await screen.findByText('Failed: Error: error message'))
        .toBeInTheDocument();
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
