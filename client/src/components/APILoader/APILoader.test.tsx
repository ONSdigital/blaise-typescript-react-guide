import React from 'react';
import { render, RenderResult, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import APIContext from '../APIContext';
import APILoader from './APILoader';

describe('APILoader', () => {
  const mock = new MockAdapter(axios);
  const config = { endpoint: 'https://example.com/api/v1' };

  function renderAPILoader() {
    return render(
      <APIContext.Provider value={config}>
        <APILoader
          renderLoading="Loading Message"
          renderError={(error) => `Failed: ${error}`}
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
        .reply(() => new Promise((resolve) => {
          setTimeout(() => resolve([200, []]), 200);
        }));
    });

    it('displays the loading message', () => {
      renderAPILoader();
      expect(screen.getByText('Loading Message')).toBeInTheDocument();
    });

    test('snapshot', () => {
      const wrapper = renderAPILoader();
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when request is successful', () => {
    beforeEach(() => {
      mock.onGet('https://example.com/api/v1/surveys')
        .reply(200, ['SURVEY1', 'SURVEY2']);
    });

    it('renders children with surveys', async () => {
      renderAPILoader();
      expect(await screen.findByText('SURVEY1')).toBeInTheDocument();
      expect(await screen.findByText('SURVEY2')).toBeInTheDocument();
    });

    test('snapshot', async () => {
      const wrapper = renderAPILoader();
      await screen.findByText('SURVEY1');
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when HTTP error is returned', () => {
    beforeEach(() => {
      mock.onGet('https://example.com/api/v1/surveys')
        .reply(500, 'error occurred');
    });

    it('displays HTTP errors', async () => {
      renderAPILoader();
      expect(await screen.findByText('Failed: Error: Request failed with status code 500')).toBeInTheDocument();
    });

    test('snapshot', async () => {
      const wrapper = renderAPILoader();
      await screen.findByText(/Failed:/);
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when error is thrown', () => {
    beforeEach(() => {
      mock.onGet('https://example.com/api/v1/surveys')
        .reply(() => {
          throw new Error('error message');
        });
    });

    it('displays non-HTTP errors', async () => {
      renderAPILoader();
      expect(await screen.findByText('Failed: Error: error message'))
        .toBeInTheDocument();
    });

    test('snapshot', async () => {
      const wrapper = renderAPILoader();
      await screen.findByText(/Failed:/);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
