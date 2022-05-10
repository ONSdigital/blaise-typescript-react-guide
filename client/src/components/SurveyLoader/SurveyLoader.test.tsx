import React from 'react';
import { render, RenderResult, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import APIContext from '../APIContext';
import SurveyLoader from './SurveyLoader';

describe('SurveyLoader', () => {
  const mock = new MockAdapter(axios);
  const config = { endpoint: 'https://example.com/api/v1' };

  let wrapper: RenderResult;

  function renderSurveyLoader() {
    return render(
      <APIContext.Provider value={config}>
        <SurveyLoader loadingMessage="Loading Message" errorMessage={(error) => `Failed: ${error}`}>
          {(surveys) => surveys.map((survey) => <div key={survey}>{survey}</div>)}
        </SurveyLoader>
      </APIContext.Provider>,
    );
  }

  describe('when waiting for the response', () => {
    beforeEach(() => {
      mock.onGet('https://example.com/api/v1/surveys')
        .reply(() => new Promise(() => { /* never resolve */ }));

      wrapper = renderSurveyLoader();
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

      wrapper = renderSurveyLoader();
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

      renderSurveyLoader();
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

      renderSurveyLoader();
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
