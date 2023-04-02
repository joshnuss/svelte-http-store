import { readable } from 'svelte/store'

export function httpStore(url, options = {}) {
  let set
  const initialValue = { loading: true }
  const store = readable(initialValue, (setter) => {
    set = setter
  })

  store.fetch = async (url, options = {}) => {
    await fetch(url, options)
      .then((response) => response.json())
      .then((json) => {
        set({ loading: false, ...json })
      })
  }

  store.refresh = async () => {
    await store.fetch(url, options)
  }

  store.refresh()

  return store
}
