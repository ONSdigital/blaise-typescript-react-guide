import React from 'react';
import { render } from '@testing-library/react';
import LoadingSpinner from './index';

describe('LoadingSpinner', () => {
  test('snapshot', () => {
    const wrapper = render(<LoadingSpinner />);
    expect(wrapper).toMatchSnapshot();
  });
});
