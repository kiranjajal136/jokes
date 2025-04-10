<template>
  <v-card class="mb-4 pa-4" elevation="2" transition="slide-y-transition">
    <v-card-title class="text-h6">{{ joke.setup }}</v-card-title>

    <v-card-subtitle>{{ joke.punchline }}</v-card-subtitle>

    <v-card-text>
      <div class="text-caption text-grey">
        Category: <strong>{{ joke.type }}</strong>
      </div>
      <RatingStars
        :joke="joke"
        @rate="(r) => $emit('rate', r)"
        class="mt-2"
      />
    </v-card-text>

    <v-card-actions>

    <v-menu>
      <template #activator="{ props }">
        <v-btn
          v-bind="props"
          variant="outlined"
          color="primary"
          prepend-icon="mdi-share-variant"
          data-test-id="share-joke"
        >
          Share
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="(option, index) in shareOptions"
          :key="index"
          @click="option.action"
          class="d-flex align-center"
        >
          <v-icon :color="option.color" start>{{ option.icon }}</v-icon>
          <v-list-item-title>{{ option.label }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-spacer/>

     <v-btn
        variant="outlined"
        color="error"
        @click="$emit('remove')"
        prepend-icon="mdi-delete"
        data-test-id="delete-joke"
      >
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import type { Joke, ShareOption } from '../types/joke'
import { ref, watch, computed } from 'vue'

const props = defineProps<{
  joke: Joke
}>()

function share(platform: string) {
  const jokeText = `${props.joke.setup} ${props.joke.punchline}`
  let url = ''

  const encoded = encodeURIComponent(jokeText)

  switch (platform) {
    case 'twitter':
      url = `https://twitter.com/intent/tweet?text=${encoded}`
      break
    case 'whatsapp':
      url = `https://api.whatsapp.com/send?text=${encoded}`
      break
    case 'facebook':
      url = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`
      break
  }

  window.open(url, '_blank')
}

function copyToClipboard() {
  const jokeText = `${props.joke.setup} ${props.joke.punchline}`
  navigator.clipboard.writeText(jokeText)
  alert('Joke copied to clipboard!')
}

const shareOptions = computed<ShareOption[]>(() => [
  {
    label: 'Twitter',
    icon: 'mdi-twitter',
    color: '#1DA1F2',
    action: () => share('twitter')
  },
  {
    label: 'WhatsApp',
    icon: 'mdi-whatsapp',
    color: '#25D366',
    action: () => share('whatsapp')
  },
  {
    label: 'Facebook',
    icon: 'mdi-facebook',
    color: '#1877F2',
    action: () => share('facebook')
  },
  {
    label: 'Copy to Clipboard',
    icon: 'mdi-content-copy',
    color: 'grey',
    action: copyToClipboard
  }
])
</script>

<style scoped>
.v-list-item :deep(.v-list-item__content) {
  display: flex;
}
</style>