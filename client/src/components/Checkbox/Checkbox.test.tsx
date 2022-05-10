import React, {
  act, fireEvent, render, RenderResult, screen,
} from '@testing-library/react';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  let label: HTMLElement;
  let checkbox: HTMLInputElement;
  let onChecked: jest.Mock;
  let onUnchecked: jest.Mock;
  let wrapper: RenderResult;

  beforeEach(() => {
    onChecked = jest.fn();
    onUnchecked = jest.fn();
    wrapper = render(
      <Checkbox
        label="Option 1"
        onChecked={onChecked}
        onUnchecked={onUnchecked}
      />,
    );
    label = screen.getByText('Option 1');
    checkbox = screen.getByLabelText('Option 1');
  });
  it('displays the label', () => {
    expect(label).toBeInTheDocument();
  });

  it('defaults to unchecked', () => {
    expect(checkbox.checked).toBe(false);
  });

  describe('when unchecked', () => {
    it('triggers onChecked when clicked', () => {
      act(() => { fireEvent.click(label); });
      expect(onChecked).toHaveBeenCalled();
    });

    it('does not triggers onUnchecked when clicked', () => {
      act(() => { fireEvent.click(label); });
      expect(onUnchecked).not.toHaveBeenCalled();
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('when checked', () => {
    beforeEach(() => {
      act(() => { fireEvent.click(label); });
      onChecked.mockClear();
      onUnchecked.mockClear();
    });

    it('triggers onUnchecked when clicked', () => {
      act(() => { fireEvent.click(label); });
      expect(onUnchecked).toHaveBeenCalled();
    });

    it('does not trigger onChecked when clicked', () => {
      act(() => { fireEvent.click(label); });
      expect(onChecked).not.toHaveBeenCalled();
    });

    test('snapshot', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
