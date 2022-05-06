# Basic React Concepts

The document introduces the aspects of React via the concepts that are directly
used in our codebase.

## What is React?

React is a _front-end_, _declarative_, _component-based_ framework.

- **front-end**:
    Runs in the browser create dynamic user experiences.
- **declarative**:
    You declare how the view should render based on the state,
    rather than manipulating it when the state changes.  
- **component-based**:
    You design the application using self-contained, composable components.

## React Components

React components can be defined in multiple different ways.

The most common types of components are _class components_ and
_functional components_.

The general trend now is towards _functional components_; these are what we
prefer in Blaise.

### Functional Components

Functional components are the most concise type of component. Previously, class
components were more capable than class components, but with the recent
introduction of [hooks](https://reactjs.org/docs/hooks-intro.html), functional
components can be used exclusively.

```typescript jsx
import { ReactElement } from "react";

interface CounterProps {
    name: string
}

export default function Counter({ name }: CounterProps): ReactElement {
    const [count, setCount] = useState(0);

    function increment() {
        setCount(currentCount => currentCount + 1)
    }

    return (
        <div className="counter">
            <span>{ name }</span>
            <span>{ count }</span>
            <button onClick={ increment }>Increment</button>
        </div>
    );
}  
```

### Class Components

Class components use classes which expose specific methods which React then uses.
The most important method is the `render()` method, but you can define
[other methods](https://reactjs.org/docs/react-component.html) if required.

```typescript jsx
interface CounterState {
    count: number
}

interface CounterProps {
    name: string
}

export default class Counter extends React.Component<CounterProps, CounterState>
{
    constructor(props: CounterProp){
        super(props);
        this.state = { count: 0 };
    }
    
    increment = () => {
        this.setState({count: this.state.count + 1});
    }
    
    render() {
        return (
            <div className="counter">
                <span>{this.props.name}</span>
                <span>{this.state.count}</span>
                <button onClick={increment}>Increment</button>
            </div>
        );
    }
}  
```

## Types of _Variables_

When working with React components, there are types of _variable_ that you are
need to work with when developing React components.

- **props** variables
- **state** variables
- **local** variables
- **context** variables

### Props

Props are used to pass values into a component from a parent.

You **MUST NOT** update props within your component.

If a prop value changes from out-side the component, your component **WILL** rerender.

```typescript jsx
interface HelloProps {
    subject: string
}

function Hello({subject}: HelloProps): ReactElement {
    return <>Hello {subject}</>
}
```

```jsx
<App>
    <Hello subject="World" />
</App>
```

#### Callback Properties

If you need to send a value back from a component to a parent component, you
can pass a function as a property.

```typescript jsx
import { ReactElement } from "react";

interface InputProps {
    onUpdate: (value: string) => void
}

function Input({ onUpdate }: InputProps): ReactElement {
    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        onUpdate(event.target.value);
    }

    return (
        <input type="text" onChange={onChange} />
    )
}
```

```jsx
<App>
    <Input onUpdate={(value) => console.log(value)} />
</App>
```

#### The `children` Property

You can define a special property called `children` while allows you to render
the child components of a property.

```typescript jsx
interface FancyBoxProps {
    children: ReactNode
}

function FancyBox({ children }: FancyBoxProps): ReactElement {
    return <div className="fancy-box">{children}</div>;
}
```

```jsx
<App>
    <FancyDiv>
        <div className="title">Fancy Box Title</div>
        This is the contents of the box.
    </FancyDiv>
</App>
```

You can also define `children` as a function if you want to pass something down
to child components.

```typescript jsx
interface UpperCaseProps {
    value: string
    children: (items: string) => ReactNode
}

function UpperCase({value, children}: UpperCaseProps): ReactElement {
    return children(value.toUpperCase());
}
```
```jsx
<App>
    <UpperCase value={'world'}>
        {(subject) => <Hello subject={subject} />}
    </UpperCase>
</App>
```

### State

State variables are for values that you want to change within the component.

You **MUST** update state with the setter function.

Any time a state variable changes, your component **WILL** rerender.

```typescript jsx
function Counter(): ReactElement {
    const [count, setCount] = useState(0);

    function increment() {
        setCount(currentCount => currentCount + 1)
    }

    return (
        <div className="counter">
            <span>{ count }</span>
            <button onClick={ increment }>Increment</button>
        </div>
    );
}
```

You can pass a new value into the setter function directly:

```typescript
setCount(20)
```

But if you want to update the state based on the current state, you must use a
callback function to ensure you are using the latest state:

```typescript
setCount(currentValue => currentValue + 1)
```

### Local Variables

You can use local variables in a component but changing them **WILL NOT** cause
the component to rerender.

Local variables should only be used to track internal state which is not
represented to the used.

```typescript jsx
function Counter(): ReactElement {
    const [item, setItem] = useState('default item');

    let itemLoaded = false;

    useEffect(() => {
        // Only load the items if they have not already been loaded
        //
        // NOTE: This is for example purposes only, there would be better ways
        //       to approach this in your code.
        if (!itemLoaded) {
            loadItem().then((loadedItem) => {
                setItem(loadedItem);
                itemLoaded = true;
            })
        }
    });
    
    return <div>{item}</div>;
}
```

### Context

Context provides an input to components like props, except you can access a
context without having to parse it all the way down the component hierarchy.

Context can be thought of like global variables and should be reserved for
special circumstances where many components might want access the same value.
Typical examples are _the currently selected theme_ or _which user is currently
logged in_.

```typescript jsx
import { ReactElement, useContext } from "react";

interface User {
    name: string
}

const UserContext = React.createContext<User | null>(null);

function UserPanel(): ReactElement {
    const user = useContext(UserContext);

    if (user === null) {
        return <div className="user-panel">User not logged in</div>
    }

    return <div className="user-panel">Current use: { user.name }</div>
}

function SideBar(): ReactElement {
    return (
        <div className="side-bar">
            <div className="side-bar-title">Side Bar</div>
            <UserPanel />
        </div>
    )
}
```
```jsx
<App>
    <UserContext.Provider value={loggedInUser}>
        <SideBar />
    </UserContext.Provider>
</App>
```

## Hooks

Hooks are a means to share reusable code between components.

By convention, they are functions what are named `useSomething`.

React provides a number of hooks for you to use, but you can also write your
own hooks.

### Common Hooks

The most common hooks you will see are `useState` (which have seen already) and
`useEffect` (which we will look at next).

React also provides more hooks such as `useMemo` which can be used for
performance optimisation, and, `useReducer` for managing more complicated state.

A list of React's hooks can be found
[here](https://reactjs.org/docs/hooks-reference.html), it's worth having a scan
to familiarise yourself with what is available.

#### `useEffect`

The use effect hook is where you write any code that performs side effects.

> Mutations, subscriptions, timers, logging, and other side effects are not
> allowed inside the main body of a function component (referred to as React’s
> render phase). Doing so will lead to confusing bugs and inconsistencies in the
> UI.

We use them often to make HTTP requests the APIs.

The `useEffect` functions are called after every successful rerender of the
component. A second argument can be provided to specify a list of dependencies
which will limit it when the function is called.

```typescript
useEffect(() => {
    // this will get called every time the component rerenders
});

useEffect(() => {
    // this will get called only the first time the component renders
}, []);

useEffect(() => {
    // this will get called only when stateValue or propValue is updated
}, [stateValue, propValue]);
```

Since the `useEffect` call backs are not async, you have to handle the promises.

```typescript
useEffect(() => {
    async function fetchData() {
        const data = await someAsyncAction();
        return data;
    }
    
    fetchData()
        .then(data => setData(data))
        .catch(() => setError('fetchData failed'));
}, [])
```

### Rules of Hooks

There are a number of rules you need to follow when calling hooks. **Disobeying
these rules can result in bugs!**

The rules are described in
[Rules of Hooks](https://reactjs.org/docs/hooks-rules.html).

Learning these rules is a good idea, but the safer approach is to configure
ESLint with the
[eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
plugin and have it stop you from making silly mistakes.

### Building Hooks

You can build custom hooks by simply defining a function called `useYouHookName`
and building logic using the existing React Hooks.

```typescript
import { useEffect } from "react";

function useUserDetails(userId: number) {
    const [state, setState] = useState('loading');
    const [userDetails, setUserDetails] = userDetails<UserDetails | null>(null);

    useEffect(() => {
        loadUserById(userId)
            .then((data) => {
                setUserDetails(data);
                setState('loaded');
            })
            .catch(() => {
                setState('error');
            })
    }, [])

    return [ userDetails, state ];
}
```

```typescript jsx
interface UserPanelProps {
    userId: number
}

function UserPanel({ userId }: UserPanelProps): ReactElement {
    const [ userDetails, userDetailsState ] = usesUserDetails(userId);
    
    switch (userDetailsState) {
        case 'loading':
            return <div>Loading user...</div>;
        case 'error':
            return <div>Error loading user</div>;
        case 'loaded':
            return <div>User: {user.name}</div>;
    }
}
```

## Further Reading

This guide focussed on the basic idea of each concept. For more details, it's
recommended to check out the
[React Docs](https://reactjs.org/docs/testing-recipes.html); specifically the
**Main Concepts**, **Hooks** and **Advanced Guides** sections.
