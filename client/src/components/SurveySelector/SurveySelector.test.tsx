import React from 'react';
import {
  act, fireEvent, render, RenderResult, screen,
} from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import SurveySelector from './SurveySelector';
import APIContext from '../APIContext';

describe('SurveySelector', () => {
  const httpMock = new MockAdapter(axios);
  const apiContext = { endpoint: 'http://example.com/api' };

  let wrapper: RenderResult;
  let onUpdate: jest.Mock;

  function renderSurveySelector() {
    onUpdate = jest.fn();
    wrapper = render(
      <APIContext.Provider value={apiContext}>
        <SurveySelector onUpdate={onUpdate} />
      </APIContext.Provider>,
    );
  }

  describe('when loading', () => {
    beforeEach(() => {
      httpMock.onGet('http://example.com/api/surveys')
        .reply(() => new Promise(() => { /* never resolve */ }));
      renderSurveySelector();
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when surveys are listed', () => {
    beforeEach(() => {
      httpMock.onGet('http://example.com/api/surveys')
        .reply(200, ['SURVEY1', 'SURVEY2']);
      renderSurveySelector();
    });

    it('renders the select surveys message', async () => {
      expect(await screen.findByText('Which surveys are your favourite?')).toBeInTheDocument();
    });

    it('renders the list of surveys', async () => {
      expect(await screen.findByText('SURVEY1')).toBeInTheDocument();
      expect(await screen.findByText('SURVEY1')).toBeInTheDocument();
    });

    it('calls onUpdate when options are checked/unchecked', async () => {
      await screen.findByText('SURVEY1');
      act(() => {
        fireEvent.click(screen.getByLabelText('SURVEY1'));
        fireEvent.click(screen.getByLabelText('SURVEY2'));
        fireEvent.click(screen.getByLabelText('SURVEY1'));
      });
      expect(onUpdate).toHaveBeenCalledTimes(3);
      expect(onUpdate.mock.calls[0]).toContainEqual(['SURVEY1']);
      expect(onUpdate.mock.calls[1]).toContainEqual(['SURVEY1', 'SURVEY2']);
      expect(onUpdate.mock.calls[2]).toContainEqual(['SURVEY2']);
    });

    test('snapshot', async () => {
      await screen.findByText('SURVEY1');
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when a loading error occurs', () => {
    beforeEach(() => {
      httpMock.onGet('http://example.com/api/surveys')
        .reply(500, {});
      renderSurveySelector();
    });

    test('snapshot', async () => {
      await screen.findByText('Error:');
      expect(wrapper).toMatchSnapshot();
    });
  });
});
