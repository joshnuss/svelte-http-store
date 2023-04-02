# svelte-http-store

A [Svelte store](https://svelte.dev/docs#run-time-svelte-store) backed by the [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API.

## Installation

```sh
pnpm install -D svelte-http-store
```

## Example

```javascript
// in src/lib/stores/cart.js
import { httpStore } from 'svelte-http-store'

// performs a `GET /cart` request
export const store = httpStore('/cart')

// store.refresh() will request `GET /cart` again
store.refresh()

// call store.fetch() to mutate:
store.fetch('/cart', { method: 'PATCH' })
```

Feel free to wrap the `store.fetch()` with functions that fit your domain:

```javascript
// example: function to add items to the cart
store.add = ({ product, quantity }) => {
  const url = `/cart/${product.id}`
  const body = JSON.stringify({ quantity })

  cart.fetch(url, { method: 'POST', body })
}

// example: function to clear the cart
store.clear = () => {
  cart.fetch('/cart', { method: 'DELETE' })
}
```

## License

MIT
