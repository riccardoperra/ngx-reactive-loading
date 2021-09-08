---
sidebar_position: 1
---

# Basic usage

The loading registry is an object that <strong>can holds dynamically the loading states</strong> of your application.
The difference is substantial, since it allows you to define the loading states dinamically,
removing or adding it when you need it.

The loading registry is an object that can holds dynamically the loading states of your application. Create a
loading registry you must invoke the `createLoadingRegistry` function.

```ts title="loading.state.ts"
import { createLoadingRegistry } from 'ngx-reactive-loading';

const registry = createLoadingRegistry();
```

:::info Provide default keys
You can provide default keys for loading registry passing an array of `PropertyKey` to the `createLoadingRegistry()` function

```ts
import { createLoadingRegistry } from 'ngx-reactive-loading';

const defaultKeys = ['add', 'delete'];
const registry = createLoadingRegistry(defaultKeys);
```
:::

With this setup you get a `LoadingRegistry` with the following methods:

## API

### `add()`

Insert a new loading state to the registry.

```ts title="loading.state.ts"
registry.add('key');
```

### `addAll()`

Insert multiple loading states to the registry.

```ts title="loading.state.ts"
registry.addAll(['key1', 'key2']);
```

### `get()`

Get the loading state from the registry snapshot by the given key.

```ts title="loading.state.ts"
const keyLoadingState = registry.get('key');
```

### `track()`

Like `withLoading` operator helper, you can perform a side effect for every emission on the source Observable, updating
the state of the key when the source is subscribed and when terminates on complete using the `track()` method.

If the given property does not exist into the registry when subscribing to the source, no actions will be performed.

```ts title="loading.state.ts"
const keyLoadingState = registry.get('key');
```

### `isLoading()`

Listen to the given property state changes and return true if it finds a state which is currently loading

```ts title="loading.state.ts"
const isLoading$ = registry.isLoading('key');
```

:::info `isLoading()  is lazy!
Since the loading registry is reactive, `isLoading()` works even if the registry
key does not already exist, so the returned observable will emit new values only after
the given property is added to the registry.

```ts
const isLoading$ = registry.isLoading('key');

const subscription = isLoading$.subscribe();

registry.add('key');

// `isLoading$` is ready to listen to changes
// ...

registry.delete('key');
// `isLoading$` stop listening to changes
```
:::

### `someLoading()`

Listen to the state changes of the given properties and return true if it finds a state which is currently loading.

```ts title="loading.state.ts"
const isLoading$ = registry.isLoading('key');
```

:::info `someLoading()  is lazy!
Since the loading registry is reactive, `someLoading()` works even if the registry
key does not already exist, so the returned observable will emit new values only after
the given property is added to the registry.

```ts
const isLoading$ = registry.someLoading(['key', 'key2']);

const subscription = isLoading$.subscribe();

registry.addAll(['key', 'key2']);

// `isLoading$` is ready to listen to `key` and `key2` changes
// ...

registry.delete('key');
// `isLoading$` stop listening to `key` changes, but still listening to `key2`
```
:::


### `delete()`

Remove a loading state from the registry. All active subscriptions will be closed.

```ts title="loading.state.ts"
registry.delete('key1');
```

### `destroy()`

Remove all loading state from the registry, then close all active subscriptions.

```ts title="loading.state.ts"
registry.destroy();
```

### `keys()`

Returns the keys of the registry snapshot.

```ts title="loading.state.ts"
registry.addAll(['key', 'key2']);
const keys: PropertyKey[] = registry.keys(); // ['key', 'key2']
```

### `registry$`

Listen to the changes of all loading states. A new value will be emitted after each state update of the registry:
- after `add()`, `remove()`, `destroy()`, `addAll()`
- after each loading state change through `track()`

```ts title="loading.state.ts"
const changes$: Observable<{ [key in PropertyKey]: boolean }> = registry.registry$;
```
