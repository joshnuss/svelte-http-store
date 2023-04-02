import { describe, test, expect, beforeEach, vi } from 'vitest'
import { httpStore } from '$lib/index'
import { get } from 'svelte/store'

describe('httpStore', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  test('initial state is loading', async () => {
    fetch.mockResolvedValueOnce({
      json: () => {}
    })

    const store = httpStore('/cart')

    await flushPromises()

    const value = get(store)

    expect(value).toEqual({ loading: false })
    expect(fetch).toBeCalledWith('/cart', {})
  })

  test('sets state when fetch completes', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ someValue: 41 })
    })

    const store = httpStore('/cart')
    get(store)

    await flushPromises()

    const value = get(store)

    expect(value).toEqual({
      loading: false,
      someValue: 41
    })

    expect(fetch).toBeCalledWith('/cart', {})
  })

  test('refresh', async () => {
    fetch
      .mockResolvedValueOnce({
        json: async () => ({ someValue: 41 })
      })
      .mockResolvedValueOnce({
        json: async () => ({ someValue: 42 })
      })

    const store = httpStore('/cart')
    const values = []

    store.subscribe((value) => values.push(value))

    await store.refresh()

    expect(values).toEqual([
      { loading: true },
      { loading: true },
      {
        loading: false,
        someValue: 41
      },
      {
        loading: false,
        someValue: 42
      }
    ])

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).toBeCalledWith('/cart', {})
  })

  test('fetch', async () => {
    fetch
      .mockResolvedValueOnce({
        json: async () => ({ someValue: 41 })
      })
      .mockResolvedValueOnce({
        json: async () => ({ someValue: 42 })
      })

    const store = httpStore('/cart')
    const values = []

    store.subscribe((value) => values.push(value))

    await store.fetch('/cart', { method: 'PATCH' })

    expect(values).toEqual([
      { loading: true },
      { loading: true },
      {
        loading: false,
        someValue: 41
      },
      {
        loading: false,
        someValue: 42
      }
    ])

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(fetch).toBeCalledWith('/cart', {})
    expect(fetch).toBeCalledWith('/cart', { method: 'PATCH' })
  })
})

function flushPromises() {
  return new Promise((resolve) => setImmediate(resolve))
}
