<template>
  <v-dialog v-model="dialog" width="500">
    <template #activator="{ props }">
      <v-btn v-bind="props" color="primary">{{ JokeLabels.AddJoke }}</v-btn>
    </template>
    <v-card>
      <v-card-title>{{ JokeLabels.AddNewJoke }}</v-card-title>
      <v-card-text>
        <form @submit.prevent="submit">
          <v-text-field
            v-model="setup"
            :label="JokeLabels.Setup"
            :error-messages="v$.setup.$errors.map(e => e.$message)"
            @blur="v$.setup.$touch"
          />
          <v-text-field
            v-model="punchline"
            :label="JokeLabels.Punchline"
            :error-messages="v$.punchline.$errors.map(e => e.$message)"
            @blur="v$.punchline.$touch"
          />
          <v-combobox
            v-model="type"
            :items="allCategories"
            :label="JokeLabels.Category"
            :error-messages="v$.type.$errors.map(e => e.$message)"
            @blur="v$.type.$touch"
            clearable
            chips
          />
        </form>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="success"
          @click="submit"
          :disabled="isFormInvalid"
        >
          {{ JokeLabels.Save }}
        </v-btn>
        <v-btn text @click="dialog = false">{{ JokeLabels.Cancel }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useJokeStore } from '~/stores/jokes'
import { JokeLabels, ErrorMessages, type Joke } from '~/types/joke'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'

const emit = defineEmits<{
  (e: 'add', joke: Joke): void
}>()

const { jokes } = useJokeStore()

const setup = ref('')
const punchline = ref('')
const type = ref('')
const dialog = ref(false)

const allCategories = computed(() => {
  const apiCats = jokes?.map(j => j.type) ?? []
  return [...new Set(apiCats)].filter(Boolean)
})

const rules = computed(() => ({
  setup: { required },
  punchline: { required },
  type: { required },
}))

const v$ = useVuelidate(rules, { setup, punchline, type })

const isFormInvalid = computed(() => {
  return v$.value.$invalid
})

function submit() {
  v$.value.$touch()
  if (v$.value.$invalid) return

  emit('add', {
    _id: Date.now().toString(),
    setup: setup.value,
    punchline: punchline.value,
    type: type.value,
    rating: 0,
  })

  setup.value = ''
  punchline.value = ''
  type.value = ''
  v$.value.$reset()
  dialog.value = false
}
</script>
