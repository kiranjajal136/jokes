import { ref, watch } from 'vue'

export function useLocalStorage(key: string, initialValue: any) {
  const data = ref(initialValue)

  if (process.client) {
    try {
      const storedValue = localStorage.getItem(key)
      const parsed = storedValue ? JSON.parse(storedValue) : initialValue

      if (Array.isArray(initialValue) && !Array.isArray(parsed)) {
        data.value = []
      } else if (
        typeof initialValue === 'object' &&
        initialValue !== null &&
        typeof parsed === 'object'
      ) {
        data.value = parsed
      } else {
        data.value = parsed
      }
    } catch (err) {
      console.warn(`Error parsing localStorage for key "${key}"`, err)
      data.value = initialValue
    }

    watch(
      data,
      (val) => {
        localStorage.setItem(key, JSON.stringify(val))
      },
      { deep: true }
    )
  }

  return data
}
