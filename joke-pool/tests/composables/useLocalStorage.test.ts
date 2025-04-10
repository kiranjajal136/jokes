import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useLocalStorage } from '../../composables/useLocalStorage'

describe('useLocalStorage', () => {
  const originalClient = globalThis.process?.client

  beforeEach(() => {
    globalThis.process = { ...globalThis.process, client: true }
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    globalThis.process.client = originalClient
  })

  it('should load data from localStorage if present', () => {
    localStorage.setItem('testKey', JSON.stringify('hello world'))

    const spy = vi.spyOn(Storage.prototype, 'getItem')
    const result = useLocalStorage('testKey', 'abc')

    expect(spy).toHaveBeenCalledWith('testKey')
    expect(result.value).toBe('hello world')
  })

  it('should fallback to initial value if no localStorage value exists', () => {
    const result = useLocalStorage('emptyKey', 'defaultVal')
    expect(result.value).toBe('defaultVal')
  })

  it('should store new value in localStorage when ref changes', async () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem')
    const data = useLocalStorage('updateKey', 0)

    data.value = 42

    await new Promise(resolve => setTimeout(resolve(), 0))

    expect(spy).toHaveBeenCalledWith('updateKey', JSON.stringify(42))
  })

  it('should parse array value from localStorage', () => {
    const arr = [1, 2, 3]
    localStorage.setItem('arrKey', JSON.stringify(arr))

    const result = useLocalStorage('arrKey', [])
    expect(Array.isArray(result.value)).toBe(true)
    expect(result.value).toEqual(arr)
  })

  it('should handle bad JSON gracefully and fallback', () => {
    localStorage.setItem('errorKey', 'not-json')

    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const result = useLocalStorage('errorKey', { foo: 'bar' })

    expect(result.value).toEqual({ foo: 'bar' })
    expect(warnSpy).toHaveBeenCalled()
  })
})
