import { readable } from 'svelte/store'

export function httpStore(url, options = {}) {
  let set
  const initialValue = { loading: true }
  const store = readable(initialValue, (setter) => {
    set = setter
  })

  store.fetch = async (url, options = {}) => {
    const response = await fetch(url, options)
    const json = await response.json()

    set({ loading: false, ...json })
  }

  store.refresh = () => {
    return store.fetch(url, options)
  }

  store.refresh()

  return store
}
