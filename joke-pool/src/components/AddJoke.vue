<template>
    <JokeModal @add="addNewJoke"/>
</template>
  
  <script setup lang="ts">
  import { useJokeStore } from '~/stores/jokes'
  import type { Joke } from '~/types/joke'
  
  const store = useJokeStore()
  const { addJoke } = store
  
  function addNewJoke(joke: Joke) {
    addJoke(joke)
  }
  </script>
  