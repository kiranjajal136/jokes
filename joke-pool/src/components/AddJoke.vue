<template>
    <JokeModal @add="addNewJoke"/>
</template>
  
<script setup lang="ts">
  import { useJokeStore } from '~/stores/jokes'
  import type { Joke } from '~/types/joke'

  const { addJoke } = useJokeStore()
  
  function addNewJoke(joke: Joke) {
    addJoke(joke)
  }
</script>
  