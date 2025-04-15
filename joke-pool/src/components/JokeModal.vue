<template>
  <v-dialog v-model="dialog" width="500">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary">{{ JOKE_LABELS.addJoke }}</v-btn>
    </template>
    <v-card>
      <v-card-title>{{ JOKE_LABELS.addNewJoke }}</v-card-title>
      <v-card-text>
        <form @submit.prevent="submit">
          <v-text-field
            v-model="setup"
            :label="JOKE_LABELS.setup"
            :rules="[requiredRule('Setup')]"
          />
          <v-text-field
            v-model="punchline"
            :label="JOKE_LABELS.punchline"
            :rules="[requiredRule('Punchline')]"
          />
          <v-combobox
            v-model="type"
            :items="allCategories"
            :label="JOKE_LABELS.category"
            :rules="[requiredRule('Category')]"
            clearable
            chips
          />
        </form>
      </v-card-text>
      <v-alert
        v-if="errorMessage"
        type="error"
        dense
      >
        {{ errorMessage }}
      </v-alert>
      <v-card-actions>
        <v-btn color="success" @click="submit">{{ JOKE_LABELS.save }}</v-btn>
        <v-btn text @click="dialog = false">{{ JOKE_LABELS.cancel }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useJokeStore } from '../stores/jokes'
import type { Joke } from '../types/joke'
import { computed, ref } from 'vue'
import { JOKE_LABELS } from '../constants/index'

const store = useJokeStore()

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

const setup = ref<string>('')
const punchline = ref<string>('')
const type = ref<string>('')
const dialog = ref<boolean>(false)

const errorMessage = ref('')

function submit() {
  errorMessage.value = ''

  if (!setup.value || !punchline.value || !type.value) {
    errorMessage.value = 'Please fill in all fields before saving.'
    return
  }

  try {
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
  } catch (err) {
    errorMessage.value = 'Something went wrong while adding the joke.'
    console.error(err)
  }
}

</script>
