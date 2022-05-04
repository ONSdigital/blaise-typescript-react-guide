import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders hello world', () => {
  render(<App />);
  const sizeElement = screen.getByText(/Hello World/i);
  expect(sizeElement).toBeInTheDocument();
});
