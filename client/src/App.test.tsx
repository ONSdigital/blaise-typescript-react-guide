import React from 'react';
import { render, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import App from './App';

test('renders selector', async () => {
  const mock = new MockAdapter(axios);
  mock
    .onGet('http://localhost:5000/surveys')
    .reply(200, ['Survey One', 'Survey Two']);
  render(<App />);
  expect(await screen.findByText('Survey One')).toBeInTheDocument();
  expect(await screen.findByText('Survey Two')).toBeInTheDocument();
});
