import React from 'react';
import {
  render, RenderResult, screen, waitFor,
} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import APIContext from '../APIContext';
import SurveyLoader from './SurveyLoader';

describe('SurveyLoader', () => {
  const mock = new MockAdapter(axios);
  const config = { endpoint: 'https://example.com/api/v1' };

  function renderSurveyLoader() {
    return render(
      <APIContext.Provider value={config}>
        <SurveyLoader renderLoading="Loading Message" renderError={(error) => `Failed: ${error}`}>
          {(surveys) => surveys.map((survey) => <div key={survey}>{survey}</div>)}
        </SurveyLoader>
      </APIContext.Provider>,
    );
  }

  describe('when waiting for the response', () => {
    beforeEach(() => {
      mock.onGet('https://example.com/api/v1/surveys')
        .reply(200, []);
    });

    it('displays the loading message', async () => {
      renderSurveyLoader();
      expect(await screen.findByText('Loading Message')).toBeInTheDocument();

      // The following waits for state updates to complete so that act warnings don't appear
      await waitFor(() => {
        expect(screen.queryByText('Loading Message')).not.toBeInTheDocument();
      });
    });

    test('snapshot', async () => {
      const wrapper = renderSurveyLoader();
      expect(wrapper).toMatchSnapshot();

      // The following waits for state updates to complete so that act warnings don't appear
      await waitFor(() => {
        expect(screen.queryByText('Loading Message')).not.toBeInTheDocument();
      });
    });
  });

  describe('when request is successful', () => {
    beforeEach(() => {
      mock.onGet('https://example.com/api/v1/surveys')
        .reply(200, ['SURVEY1', 'SURVEY2']);
    });

    it('renders children with surveys', async () => {
      renderSurveyLoader();
      expect(await screen.findByText('SURVEY1')).toBeInTheDocument();
      expect(await screen.findByText('SURVEY2')).toBeInTheDocument();
    });

    test('snapshot', async () => {
      const wrapper = renderSurveyLoader();
      await screen.findByText('SURVEY1');
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when an error occurs', () => {
    beforeEach(() => {
      mock.onGet('https://example.com/api/v1/surveys')
        .reply(500, 'error occurred');
    });

    it('displays the errors', async () => {
      renderSurveyLoader();
      expect(await screen.findByText('Failed: Error: Request failed with status code 500')).toBeInTheDocument();
    });

    test('snapshot', async () => {
      const wrapper = renderSurveyLoader();
      await screen.findByText(/Error/);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
