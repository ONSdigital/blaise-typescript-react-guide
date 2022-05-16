# JavaScript async, await and Promises

We previously discussed promises. Rather than this being an in-depth guide, it
is just a reference.

## Why Promises

Javascript uses asynchronous functions with callback instead of synchronous
functions for anything that might take some time (typically side effects).
This is because Javascript is generally used in circumstances where many things
can be happening _at once_ (i.e. for GUIs).

An asynchronous function with a call back looks like this:

```javascript
setTimeout(() => console.log('One second later'), 1000);
```

The problem with this approach is that when you have sequences of asynchornous
call back functions, you end up with code that features the
[Pyramid of doom](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming))

```javascript
console.log('three')
setTimeout(() => {
    console.log('two')
    setTimeout(() => {
        console.log('one')
        setTimeout(() => console.log("blast off"), 1000)
    }, 2000)
}, 3000)
```

A Promise is a special class which encapsulates sequences of actions to be
performed on delayed results.

```javascript
slowlyProvideNumber(5)
.then((result) => result + 1)
.then((result) => slowlyAddNumbers(result, 2))
.then((result) => console.log(result))

// Logs out 8
```

## Converting a callback function to a Promise

Many libraries provide functions (or versions of functions) which return
promises. If however, you have a function which requires a callback instead of
returning a promise, you can easily convert it by wrapping it with the `Promise`
class.

```javascript
function slowlyProvideNumber(number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(number), 1000);
  });
}
```

## Errors

Promises can also handle errors. This is done with the `reject` and `catch`
functions.

```javascript
function makeHttpRequest(url) {
  return new Promise((resolve, reject) => {
    callbackHttpRequestFunction(
      url,
      (response) => {
        if (response.status === 200) {
          resolve(response.body);
        } else {
          reject('Bad response code');
        }
      }
    );
  });
}
```

```javascript
makeHttpRequest('https://example/com')
.then((body) => console.log(`Success: ${body}`))
.catch((error) => console.log(`Error: ${error}`))
```

## `async`/`await`

The `async` and `await` keywords were introduced as syntactic sugar to make
using promises nicer.

The following:

```javascript
slowlyProvideNumber(5)
.then((result) => result + 1)
.then((result) => slowlyAddNumbers(result, 2))
.then((result) => console.log(result))
```

Can be rewritten as:

```javascript
async function asyncVersion() {
  let x = await slowlyProvideNumber(5);
  x = x + 1
  x = await slowlyAddNumbers(x, 2)
  console.log(x);
}
```

This above code is not synchronous, at any `await` call, the program may jump to
running some other code before it returns. However, you can think of it
synchronously while reading/writing the code.

In an `async` function, the `try`/`catch` keywords are re-purposed for handling
the `.catch()` method from promises.

```javascript
function syncFunction() {
  thingThatReturnsAPromis()
    .then(result => console.log(result))
    .catch(error => console.log(`Error: ${error}`));
}
```

```javascript
async function asyncFunction() {
  try {
    const result = await thingThatReturnsAPromis();
    console.log(result);
  }catch (error) {
    console.log(`Error: ${error}`);
  }
}
```

## Calling Functions that Return Promises

All `async` functions must return `Promises` (you don't have to do this
explicitly, it will be done for you when you use `return`). Functions that
return `Promises` don't have to be defined with `async`.

From the perspective of the caller, there is no difference between a function
that returns a `Promise` and an `async` function, they both just return a
`Promise`. The `async` keyword only effects what code can be written inside the
function (i.e. usage of the `await` keyword).

When calling a function which returns a promise inside an `async` function, use
the `await` keyword:

```javascript
async function asyncFunction() {
  const result = await functionThatReturnsAPromise();
  // do something with result
}
```

When calling from a non-async function, you need to use `.then()` to get the
value:

```javascript
function syncFunction() {
  functionThatReturnsAPromise().then(result => {
    // do something with result
  });
}
```
