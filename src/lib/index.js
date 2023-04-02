import { readable, get } from 'svelte/store'

export function httpStore(url, options = {}) {
  let set
  let data

  const initialValue = { loading: true }
  const store = readable(initialValue, setter => set = setter)

  get(store)

  store.fetch = async (url, options = {}) => {
    set({ loading: true, ...data })

    data = await fetch(url, options).then(r => r.json())

    set({ loading: false, ...data })
  }

  store.refresh = () => {
    return store.fetch(url, options)
  }

  store.refresh()

  return store
}
