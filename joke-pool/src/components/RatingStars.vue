<template>
  <v-rating
    v-model="rating"
    color="amber"
    background-color="grey lighten-1"
    @update:model-value="emit('rate', rating)"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  rating: number
}>()

const emit = defineEmits<{
  (e: 'rate', rating: number): void
}>()

const rating = ref(props.rating || 0)

watch(
  () => props.rating,
  (val) => {
    rating.value = val ?? 0
  }
)
</script>
