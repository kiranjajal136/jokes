<template>
  <v-rating
    v-model="rating"
    @update:model-value="emit('rate', rating)"
    color="amber"
    background-color="grey lighten-1"
  />
</template>

<script setup lang="ts">
import type { Joke } from '../types/joke'
import { ref, watch } from 'vue'

const props = defineProps<{
  joke: Joke
}>()

const emit = defineEmits<{
  (e: 'rate', rating: number): void
}>()

const rating = ref(props.joke.rating || 0)

watch(
  () => props.joke.rating,
  (val) => {
    rating.value = val ?? 0
  }
)
</script>
