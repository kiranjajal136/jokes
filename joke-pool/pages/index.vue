<template>
  <div>
    <v-container>
      <v-row class="mb-4">
        <v-col cols="12" md="12" class="d-flex flex-wrap align-center justify-space-between">
          <v-select
            :items="categories"
            v-model="categoryFilter"
            label="Filter by category"
            clearable
            class="mx-2"
          />

          <v-select
            class="ml-2"
            :items="[5, 10, 20]"
            v-model="store.jokesPerPage"
            label="Jokes per page"
          />

          <v-text-field
            v-model="searchQuery"
            label="Search jokes"
            append-icon="mdi-magnify"
            class="ml-4"
            data-test-id="search-joke"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <JokeModal @add="addJoke" />
        </v-col>
        <v-col>
          <v-btn
            color="primary"
            variant="outlined"
            @click="toggleSort"
          >
            Sort: {{ sortDirection }}
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="loading">
        <v-container class="d-flex justify-center align-center" style="height: 60vh;">
          <v-progress-circular indeterminate color="primary" size="64" />
        </v-container>
      </v-row>
      <v-row v-else>
        <v-col cols="12" md="6" v-for="joke in paginated" :key="joke._id">
          <JokeCard
            :joke="joke"
            @remove="removeJoke(joke._id)"
            @rate="(r) => rateJoke(joke._id, r)"
            @share="shareJoke(joke)"
          />
        </v-col>
      </v-row>
      <v-pagination v-model="page" :length="totalPages" class="mt-4" />
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useJokeStore } from '../stores/jokes'
import JokeCard from '../components/JokeCard.vue'
import JokeModal from '../components/JokeModal.vue'
import { useLocalStorage } from '../composables/useLocalStorage'
import type { Joke } from '../types/joke'
import { computed, onMounted, ref, watch } from 'vue'

const sortBy = useLocalStorage('sortBy', 'rating')
const sortDirection = useLocalStorage('sortDirection', 'desc')
const store = useJokeStore()

const page = ref<number>(1)
const categoryFilter = ref<string | null>(null)
const searchQuery = ref<string>('')
const loading = ref(true)

onMounted(async () => {
  loading.value = true
  try {
    await store.fetchJokes({
      sortBy: sortBy.value,
      order: sortDirection.value
    })
  } finally {
    loading.value = false
  }
})

watch(() => store.jokesPerPage, () => {
  page.value = 1
})
watch(sortBy, fetchSortedJokes)


const categories = computed<string[]>(() => {
  const all = store.allJokes.map((j: { type: Joke }) => j.type)
  return [...new Set(all)].filter(Boolean)
})

const paginated = computed<Joke[]>(() => {
  const start = (page.value - 1) * store.jokesPerPage
  return filtered.value.slice(start, start + store.jokesPerPage)
})

const totalPages = computed<number>(() =>
  Math.ceil(filtered.value.length / store.jokesPerPage)
)

const filtered = computed<Joke[]>(() => {
  const query = searchQuery.value.toLowerCase()
  return store.allJokes?.filter((j: { setup: string; punchline: string; type: string }) =>
    j.setup.toLowerCase().includes(query) ||
    j.punchline.toLowerCase().includes(query) ||
    j.type.toLowerCase().includes(query)
  )
})

function toggleSort() {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  fetchSortedJokes()
}

function fetchSortedJokes() {
  store.fetchJokes({
    sortBy: sortBy.value,
    order: sortDirection.value
  })
}

function addJoke(joke: Joke) {
  store.addJoke(joke)
}

function removeJoke(id: number) {
  if (confirm('Are you sure you want to delete this joke?')) {
    store.removeJoke(id)
  }
}

function rateJoke(id: number, rating: number) {
  store.rateJoke(id, rating)
}

function shareJoke(joke: Joke) {
  const text = `${joke.setup} — ${joke.punchline}`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}
</script>
