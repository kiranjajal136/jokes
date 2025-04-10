<template>
  <v-dialog v-model="dialog" width="500">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary">Add Joke</v-btn>
    </template>
    <v-card>
      <v-card-title>Add a New Joke</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="setup"
          label="Setup"
          :rules="[requiredRule('Setup')]"
        />
        <v-text-field
          v-model="punchline"
          label="Punchline"
          :rules="[requiredRule('Punchline')]"
        />
        <v-text-field
          v-model="type"
          label="Category"
          :rules="[requiredRule('Category')]"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn color="success" @click="submit">Save</v-btn>
        <v-btn text @click="dialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue'
import { useJokeStore } from '../stores/jokes'
import type { Joke } from '../types/joke'

const store = useJokeStore()

const dialog = ref<Boolean>(false)
const setup = ref<string>('')
const punchline = ref<string>('')
const type = ref<string>('')

const emit = defineEmits<{
  (e: 'add', joke: Joke): void
}>()

const requiredRule = (fieldName: string) => {
  return (v: string) => !!v || `${fieldName} is required`
}

const allCategories = computed(() => {
  const apiCats = store.jokes.map(j => j.type)
  return [...new Set([...apiCats])].filter(Boolean)
})

function submit() {
  if (!setup.value || !punchline.value || !type.value) return
  emit('add', {
    _id: Date.now().toString(),
    setup: setup.value,
    punchline: punchline.value,
    type: type.value,
    rating: 0,
  })
  dialog.value = false
  setup.value = ''
  punchline.value = ''
  type.value = ''
}
</script>
