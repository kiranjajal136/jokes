<template>
  <div>
    <v-container>
      <v-row class="mb-4">
        <v-col cols="12" md="12" class="d-flex flex-wrap justify-space-between">
          <v-select
            :items="categories"
            v-model="categoryFilter"
            label="Filter by category"
            clearable
            class="mx-2"
          />

          <v-select
            class="ml-2"
            :items="JOKES_PER_PAGE_OPTIONS"
            v-model="store.jokesPerPage"
            label="Jokes per page"
          />

          <v-btn
            color="primary"
            variant="outlined"
            @click="toggleSort"
            class="ml-2 flex"
            height="60"
          >
            {{ JOKE_LIST_LABELS.sortByRating }}: {{ sortDirection }}
          </v-btn>

        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <JokeModal @add="addJoke" />
        </v-col>
      </v-row>
      <v-row v-if="loading">
        <v-container class="d-flex justify-center align-center loading-container">
          <v-progress-circular indeterminate color="primary" size="64" />
        </v-container>
      </v-row>
      <v-row v-else>
        <v-col cols="12" md="6" v-for="joke in paginated" :key="joke._id">
          <JokeCard
            :joke="joke"
            @remove="removeJoke(Number(joke._id))"
            @rate="(r) => rateJoke(Number(joke._id), r)"
            @share="shareJoke(joke)"
          />
        </v-col>
      </v-row>
      <v-row class="mt-4 align-center justify-space-between">
        <v-col cols="auto">
          <div class="">
            <b>Total Jokes:</b> <strong>{{ totalItems }}</strong>
          </div>
        </v-col>

        <v-col>
          <v-pagination v-model="page" :length="totalPages" class="mt-4" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useJokeStore } from '../stores/jokes'
import JokeCard from '../components/JokeCard.vue'
import JokeModal from '../components/JokeModal.vue'
import type { Joke } from '../types/joke'
import { computed, onMounted, ref, watch } from 'vue'
import { JOKE_LIST_LABELS, JOKES_PER_PAGE_OPTIONS } from '../constants/index'

const route = useRoute()
const router = useRouter()

const store = useJokeStore()

const page = ref<number>(1)
const loading = ref(true)

const sortDirection = ref(route.query.sortDirection === 'desc' ? 'desc' : 'asc')

const sortBy = ref<string>('rating')

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

watch(() => route.query.sortDirection, (newVal) => {
  sortDirection.value = newVal === 'desc' ? 'desc' : 'asc'
  fetchSortedJokes()
})

const totalItems = computed(() => filtered.value.length)

const categories = computed<string[]>(() => {
  const all = store.allJokes.map((j: Joke) => j.type)
  return [...new Set(all)].filter(Boolean)
})

const paginated = computed<Joke[]>(() => {
  const start = (page.value - 1) * store.jokesPerPage
  return filtered.value.slice(start, start + store.jokesPerPage)
})

const totalPages = computed<number>(() =>
  Math.ceil(filtered.value.length / store.jokesPerPage)
)

const categoryFilter = ref<string | null>(null)

watch([categoryFilter], () => {
  page.value = 1
})

const filtered = computed<Joke[]>(() => {
  return store.allJokes?.filter((j: { setup: string; punchline: string; type: string }) => {
    const matchesCategory =
      !categoryFilter.value || j.type === categoryFilter.value

    return matchesCategory
  })
})

function toggleSort() {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'

  router.replace({ query: { ...route.query, sortDirection: sortDirection.value } })

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
    try {
      store.removeJoke(id)
    } catch (error) {
      console.error('Failed to delete joke:', error)
      alert('An error occurred while deleting the joke. Please try again.')
    }
  }
}

function rateJoke(id: number, rating: number) {
  try {
    const joke = store.allJokes.find(j => Number(j._id) === id)
    if (joke) {
      joke.rating = rating
    }
    store.rateJoke(id, rating)
  } catch (error) {
    console.error('Failed to rate joke:', error)
    alert('An error occurred while rating the joke. Please try again.')
  }
}

function openInNewTab(url: string) {
  window.open(url, '_blank')
}

function shareJoke(joke: Joke) {
  const text = `${joke.setup} — ${joke.punchline}`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
  openInNewTab(url)
}
</script>
<style scoped>
.loading-container {
  height: 60vh;
}
</style>