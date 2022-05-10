import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage', () => {
  it('displays the message', () => {
    render(<ErrorMessage message="example error" />);
    expect(screen.getByText('example error')).toBeInTheDocument();
  });

  test('snapshot', () => {
    const wrapper = render(<ErrorMessage message="example error" />);
    expect(wrapper).toMatchSnapshot();
  });
});
