# Testing React

You can use tests to get rapid feedback when doing React development. By writing
tests, you should be able to quickly prove your React components are behaving as
expected without the need to open a browser.

When it comes to testing the front-end, we use a few different tools:

- For testing in TypeScript/Javascript, we use the
    [Jest Framework](https://jestjs.io/).
- We then use the
    [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
    to test React code.
- We also use the
    [Axios](https://axios-http.com/) library for making HTTP requests, so we use
    [axios-mock-adapter](https://github.com/ctimmerm/axios-mock-adapter) for
    testing web requests.

We will now look at each of these in turn.

## Jest

[Jest](https://jestjs.io/) is one of the most common Javascript testing
libraries, and it works very well with React.

### Test Files

The convention we use is that test files are created alongside out code files.
They have the same name as the file they are testing but with `.test` inserted
before the file extensions:

```
├── App.test.tsx
├── App.tsx
├── components
│   └── Options
│       ├── Options.test.tsx
│       ├── Options.tsx
│       └── index.ts
└── hooks
    ├── useApiRequest.test.tsx
    └── useApiRequest.ts
```

Sometimes, there may be other types of tests (e.g. end-to-end tests) which might
exist in a separate folder, but unit tests live alongside the source code.

### Test Functions

There are two functions you can use when writing a test, `test` and `it`. There
is no difference between the two, the choice is purely on what reads better.
The recommendation is that you attempt to maintain consistency with the style
which is already in use in the repository.

```typescript
test('2 + 2 is 4', () => {
   expect(2 + 2).toBe(4); 
});

it('returns 4 when given 2 + 2', () => {
    expect(2 + 2).toBe(4);
});
```

#### Async Tests

If your test needs to call asynchronous code, you need to define the test
function with `async`:

```typescript
it('does something async', async () => {
   const value = await callAsyncFunction();
   expect(value).toEqual(123);
});
```

When testing React components, most of your tests will need to be async.

### Grouping Test Functions

There is another function which you can use to group tests, `describe`. Again,
these are just aliases to each other and the choice is based on what reads best.
A convention that works quite nicely is:

```typescript
describe('function, class or component name', () => {
    describe('when successful', () => {
        // tests...
    });
    
    describe('when failing', () => {
        // tests..
    });
});
```

### Before and After Hooks

You can use `beforeEach`, `afterEach`, `beforeAll` and `afterAll` to set up some
context before running tests. The grouping functions are hierarchical so the
context can be built up at each level.

```typescript
describe('search', () => {
    let query: Query;
    
    beforeEach(() => {
        query = new Query();
        query.setSurvey('LMS');
    });
    
    context('when no questionnaire is selected', () => {
        it('returns results for all questionnaires', () => {
            const results = search(query);
            // ...
        });
    });
    
    context('when one questionnaire is selected', () => {
        beforeEach(() => {
            query.addQuestionnaire('LMS_123');
        });
        
        it('returns results for the selected questionnaire', () => {
            const results = search(query);
            // ...
        });
    });
});
```

Further reading [Setup and Teardown](https://jestjs.io/docs/setup-teardown).

### Expectations

To assert things with Jest, you use the `expect` function. The format is:

```typescript
expect(valueToBeTested).toSomething(expectedValue);
```

`toSomething` can be one of the many matchers available. Below is a short list
of some of the most common ones, but it's worth familiarising yourself with
the [full set available](https://jestjs.io/docs/expect).

- [.toBe(item)](https://jestjs.io/docs/expect#tobevalue)
- [.toEqual(item)](https://jestjs.io/docs/expect#toequalvalue)
- [.toStrictEqual(item)](https://jestjs.io/docs/expect#tostrictequalvalue)
- [.toContain(item)](https://jestjs.io/docs/expect#tostrictequalvalue)

#### Negation

You can negate a test by adding `.not` before the matcher method:

```typescript
expect(2 + 2).not.toEqual(5);
```

## Testing React Components

The
[React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
exposes some useful functions to render and interact with React components, as
well as adding some additional matchers to test with.

At the most basic form, a React test uses the `render` function to render a
component, queries the DOM, and then tests the result.

```typescript jsx
it('renders the header text', () => {
   render(<Header text="hello" />);
   const element = screen.getByText("hello");
   expect(element).toBeInTheDocument();
});
```

### Querying

You query elements in the components via the `screen` object which can be
imported from the testing library.

```typescript
import {render, screen} from '@testing-library/react';
```

There is three types of query method on the `screen` object:

- `getBy*`: Returns the element searched for if it exists right now, otherwise errors.
- `queryBy*`: Returns the element searched for if it exists right now, otherwise returns `null`.
- `findBy*`: Returns a promise - use with `await` to wait until the search element exists.

There are also versions of these queries which return multiple results -
`getAllBy*`, `queryAllBy*`, `findAllBy*`.

For more details, and a list of the different queries available, see
[the query documentation](https://testing-library.com/docs/queries/about).

#### Pattern Matching

You can use _regular expressions_ to check for partial matches if exact strings
is not possible:

```typescript
screen.getByTest(/Error: value .* is undefined/);
```

### Expectations

The React Testing Library uses the
[jest-dom](https://github.com/testing-library/jest-dom) library which provides
a collection of useful custom matchers for Jest when testing React.

We have already seen `.toBeInTheDocument()` but it is worth familiarising
yourself with the others available
[here](https://github.com/testing-library/jest-dom#table-of-contents).

### Firing Events

To interact components, we can use the testing library's `fireEvent` object.

```typescript
import { act, fireEvent, render, screen } from '@testing-library/react';
```

You use `fireEvent` to trigger state changes in your components and then query
the result:

```typescript jsx
it('shows hidden text when Show Hidden Text is clicked', () => {
   render(<TextHider text="this text is hiddem" />);
   
   const showButton = screen.getByText('Show Hidden Text');
   act(() => fireEvent.click(showButton));
   
   const element = screen.getByText("this text is hidden");
   expect(element).toBeInTheDocument();
});
```

For more information on events, see the
[Firing Events](https://testing-library.com/docs/dom-testing-library/api-events)
documentation.

#### `act`

Any actions that update the state of the component under test should be wrapped
with the `act` function. This ensures that the component is simulated as it would
be in the browser. More details can be found
[here](https://reactjs.org/docs/test-utils.html#act). 

### Snapshots

Snapshot tests are a special type of test that is used to ensure rendered
components are not accidentally broken while making changes.

The first time you run a snapshot test, the rendered component is stored in the
`__snapshots__` folder. Subsequent times the test is run, it will fail if the
output is not the same as the saved snapshot.

Snapshots should be used to test the HTML structure of the rendered component,
**not the behaviour**.

To create a snapshot, get the component into the desire state and then call the
`.toMatchSnapshot()` matcher.

```typescript jsx
test('snapshot when hidden text is shown', () => {
   const wrapper = render(<TextHider text="this text is hiddem" />);
   
   const showButton = screen.getByText('Show Hidden Text');
   act(() => fireEvent.click(showButton));
   
   expect(wrapper).toMatchSnapshot();
});
```

#### Snapshot Workflow

1. Run the tests
2. If the test fails. inspect the changes displayed in the test output
3. If the changes are not intended, fix the implementation
4. If the changes are intended, run Jest with `-u` to update the snapshots

## HTTP Testing

When testing components which make HTTP requests using axios, you can use
[axios-mock-adapter](https://www.npmjs.com/package/axios-mock-adapter). Here is
just a small example of how you might do this:

```typescript jsx
import React from 'react';
import {
  act, render, screen, RenderResult, waitFor,
} from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import RequestComponent from './RequestComponent';


describe('RequestComponent', () => {
  const httpMock = new MockAdapter(axios);

  afterEach(() => {
    httpMock.reset();
  });
  
  it('renders the response text', async () => {
    httpMock.onGet('http://example.com/test').reply(200, 'test response');
  
    render(<RequestComponent url="http://example.com/test"/>)
  
    expect(await screen.findByText('test response')).toBeInTheDocument();
  });
});
```
