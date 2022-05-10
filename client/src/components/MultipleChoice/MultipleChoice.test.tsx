import React, {
  act, fireEvent, render, RenderResult, screen,
} from '@testing-library/react';
import MultipleChoice from './MultipleChoice';

describe('MultipleChoice', () => {
  let wrapper: RenderResult;
  let onUpdate: jest.Mock;

  beforeEach(() => {
    onUpdate = jest.fn();

    wrapper = render(
      <MultipleChoice
        question="question text"
        values={['Option 1', 'Option 2', 'Option 3']}
        onUpdate={onUpdate}
      />,
    );
  });

  it('displays the question', () => {
    expect(screen.getByText('question text')).toBeInTheDocument();
  });

  it('displays the options', () => {
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('calls onUpdate when boxes are checked/unchecked', () => {
    act(() => {
      fireEvent.click(screen.getByLabelText('Option 1'));
      fireEvent.click(screen.getByLabelText('Option 3'));
      fireEvent.click(screen.getByLabelText('Option 1'));
    });
    expect(onUpdate).toHaveBeenCalledTimes(4);
    expect(onUpdate.mock.calls[0]).toContainEqual([]);
    expect(onUpdate.mock.calls[1]).toContainEqual(['Option 1']);
    expect(onUpdate.mock.calls[2]).toContainEqual(['Option 1', 'Option 3']);
    expect(onUpdate.mock.calls[3]).toContainEqual(['Option 3']);
  });

  test('snapshot', () => {
    act(() => {
      fireEvent.click(screen.getByLabelText('Option 1'));
    });
    expect(wrapper).toMatchSnapshot();
  });
});
