<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="12" class="d-flex flex-wrap justify-space-between">
        <v-select
          v-model="categoryFilter"
          :items="categories"
          label="Filter by category"
          clearable
        />

        <v-select
          v-model="jokesPerPage"
          class="ml-2"
          :items="JOKES_PER_PAGE_OPTIONS"
          label="Jokes per page"
        />

        <v-btn
          color="primary"
          variant="outlined"
          class="ml-2 flex"
          height="60"
          @click="toggleSort"
        >
          {{ JokeListLabels.SortByRating }}: {{ sortDirection }}
        </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="isPageLoading">
      <v-container class="d-flex justify-center align-center loading-container">
        <v-progress-circular overlay indeterminate color="primary" size="64" />
      </v-container>
    </v-row>

    <v-row v-else>
      <v-col v-for="joke in jokes" :key="joke._id" cols="12" md="6">
        <JokeCard
          :joke="joke"
          @remove="() => deleteJoke(joke._id)"
          @rate="(r) => addRating(joke._id, r)"
          @share="shareJoke(joke)"
        />
      </v-col>
    </v-row>

    <v-row class="mt-4 align-center justify-space-between">
      <v-col cols="auto">
        <div>
          <b>Total Jokes:</b> <strong>{{ totalCount }}</strong>
        </div>
      </v-col>

      <v-col>
        <v-pagination v-model="page" :length="totalPages" class="mt-4" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useJokeStore } from '~/stores/jokes'
import { JokeListLabels, SortDirection, type Joke } from '~/types/joke'
import { JOKES_PER_PAGE_OPTIONS } from '~/constants'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()

const store = useJokeStore()
const {
  jokes,
  loading,
  totalCount,
} = storeToRefs(store)

const jokesPerPage = ref(store.jokesPerPage)

const { fetchJokes, removeJoke, rateJoke } = store

const page = ref(1)
const sortDirection = ref(
  route.query.sortDirection === SortDirection.Descending
    ? SortDirection.Descending
    : SortDirection.Ascending
)
const sortBy = ref('rating')
const categoryFilter = ref<string | null>(null)
const firstRenderLoading = ref(true)

const categories = computed<string[]>(() => {
  const all = jokes.value.map(j => j?.type)
  return [...new Set(all)].filter(Boolean)
})

const totalPages = computed(() =>
  Math.ceil(totalCount.value / Number(jokesPerPage.value))
)

const isPageLoading = computed(() => loading.value || firstRenderLoading.value)

watch([jokesPerPage, categoryFilter, page], ([perPage]) => {
  store.setJokesPerPage(perPage)
  fetchJokesFromBackend()
})

watch(() => route.query.sortDirection, (val) => {
  sortDirection.value = val === SortDirection.Descending
    ? SortDirection.Descending
    : SortDirection.Ascending
  page.value = 1
  fetchJokesFromBackend()
})

function toggleSort() {
  sortDirection.value = sortDirection.value === SortDirection.Ascending
    ? SortDirection.Descending
    : SortDirection.Ascending
  router.replace({ query: { ...route.query, sortDirection: sortDirection.value } })
  page.value = 1
  fetchJokesFromBackend()
}

function fetchJokesFromBackend() {
  fetchJokes({
    category: categoryFilter.value || '',
    sortBy: sortBy.value,
    order: sortDirection.value.toLowerCase(),
    page: page.value,
    limit: jokesPerPage.value,
  })
}

function deleteJoke(id: string) {
  if (confirm('Are you sure you want to delete this joke?')) {
    removeJoke(id)
  }
}

function addRating(id: string, rating: number) {
  const joke = jokes.value.find(j => j._id === id)
  if (joke) {
    joke.rating = rating
    rateJoke(id, rating)
  }
}

function shareJoke(joke: Joke) {
  const text = `${joke.setup} — ${joke.punchline}`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}

onMounted(async () => {
  await fetchJokesFromBackend()
  firstRenderLoading.value = false
})
</script>

<style scoped>
.loading-container {
  height: 60vh;
}
</style>
