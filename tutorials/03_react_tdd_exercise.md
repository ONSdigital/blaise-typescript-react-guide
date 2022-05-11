# React TDD Exercise

This is a chance to try out some things introduced in
[Basic React Concepts](./01_basic_react_concepts.md) and
[Testing React](./02_testing_react.md).

The exercise is to build a React component using tests to drive the development.

## Starting Up The Development Environment

The there are example code-bases in this repository; for this exercise you can
simply add the existing code.

### Setup

1. Clone this repository.
2. Open two terminal windows.
3. Run `yarn install` in the root of the repository.
4. In one terminal, run `yarn dev` in the [server](./server/) folder.
5. In the other terminal, run `yarn start` in the [client](./client/) folder.

Once the client is running, it should be accessible on
[http://localhost:3000](http://localhost:3000).

### Running Tests

You can run the tests in either the `client` or `server` folders by running
`yarn test`

## Approach

When do this exercise, try to implement the component using tests to convince
yourself that the code you have written is correct.

**BONUS POINTS TO ANYONE WHO MANAGES TO WRITE THE WHOLE COMPONENT USING ONLY
TESTS AND IT WORKING THE FIRST TIME IT IS OPENED IN THE BROWSER!**

## Component Requirements

The component you have to develop is Accordion menu. An accordion is a
vertically stacked, sectioned list. Each section can be expanded by clicking the
heading.

### Requirements

1. On initialisation, no sections are expanded
2. A section expands when you click the title
3. When a section expands, all other sections close
4. You can close all sections by clicking the currently expanded title

### HTML

The generated HTML should look something like this:

```html
<div class="accordion">
    <div class="accordion__section accordion__section--closed">
        <div class="accordion__section-title">Bakery</div>
    </div>
    <div class="accordion__section accordion__section--opened">
        <div class="accordion__section-title">Dairy</div>
        <ul class="accordion__items">
            <li class="accordion__item">Milk</li>
            <li class="accordion__item">Cheeses</li>
            <li class="accordion__item">Yoghurts</li>
        </ul>
    </div>
    <div class="accordion__section accordion__section--closed">
        <div class="accordion__section-title">Produce</div>
    </div>
</div>
```

### Input

```typescript
const accordionItems = [
  {
    title: 'Bakery',
    items: ['Bread', 'Cakes'],
  },
  {
    title: 'Dairy',
    items: ['Milk', 'Cheeses', 'Yoghurts'],
  },
  {
    title: 'Produce',
    items: ['Vegitables', 'Salads', 'Fruit']
  }
];
```
### Usage

```typescript jsx
<App>
  <Accordion items={accordionItems} />
</App>
```

## How to Work

1. Create new files for your component and tests. Recommended locations would be
`client/components/Accordion.tsx` and `client/components/Accordion.test.tsx`.
2. Develop your component.
3. Add `<Accordion items={accordionItems} />` to the `<App>` section of
    [App.tsx](../client/src/App.tsx).
4. Check in your browser and update/style to your heart's content.

## Stretch Exercises

If you want to add some additional functionality, here are some ideas to try
(in no particular order).

- Add a `boolean` property called `allowMultiple`; when set to true, multiple
    sections can be expanded at the same time. Also, consider added _Close All_
    and _Expand All_ buttons.
- Add a `url` property to the items and turn them into links. Consider whether
    a link should be a separate component.
- Create a new endpoint in [server.ts](../server/src/server.ts) (**don't forget
    to add tests!**) and load this list of accordion items via a HTTP request.
