import React from 'react';
import {
  act, fireEvent, render, screen,
} from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import App from './App';

test('renders selected items', async () => {
  const mock = new MockAdapter(axios);
  mock
    .onGet('http://localhost:5000/surveys')
    .reply(200, ['Survey One', 'Survey Two', 'Survey Three']);
  render(<App />);

  await screen.findByLabelText('Survey One');

  act(() => {
    fireEvent.click(screen.getByLabelText('Survey One'));
    fireEvent.click(screen.getByLabelText('Survey Three'));
  });

  expect(await screen.findByText(/Selected Surveys:.*Survey One, Survey Three/));
});
