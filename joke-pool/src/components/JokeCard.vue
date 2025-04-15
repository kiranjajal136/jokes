<template>
  <v-card class="mb-4 pa-4" elevation="2" transition="slide-y-transition">
    <v-card-title class="text-h6">{{ joke.setup }}</v-card-title>

    <v-card-subtitle>{{ joke.punchline }}</v-card-subtitle>

    <v-card-text>
      <div class="text-caption text-grey">
        Category: <strong>{{ joke.type }}</strong>
      </div>
      <div class="rating-row d-flex align-center mt-2">
        <RatingStars
          :joke="joke"
          @rate="(r) => $emit('rate', r)"
        />
        <div
          class="emoji-animate text-h4 ml-3"
          v-if="(joke?.rating ?? 0) > 0"
        >
          {{ emojiForRating }}
        </div>
      </div>
    </v-card-text>

    <v-card-actions class="d-flex justify-end gap-2">
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
import { computed } from 'vue'
import { SHARE_LABELS, RATING_THRESHOLDS } from '../constants/index'

const props = defineProps<{
  joke: Joke
}>()

const emojiForRating = computed(() => {
  const rating = props.joke?.rating

  if (!rating) return ''

  if (rating >= RATING_THRESHOLDS.high) return '😊'
  if (rating === RATING_THRESHOLDS.medium) return '😐'
  if (rating <= RATING_THRESHOLDS.low) return '😢'
  return ''
})

function share(platform: string) {
  const jokeText = `${props.joke.setup} ${props.joke.punchline}`
  let url = ''

  const encoded = encodeURIComponent(jokeText)

  switch (platform) {
    case SHARE_LABELS.twitter:
      url = `https://twitter.com/intent/tweet?text=${encoded}`
      break
    case SHARE_LABELS.whatsapp:
      url = `https://api.whatsapp.com/send?text=${encoded}`
      break
    case SHARE_LABELS.facebook:
      url = `https://www.facebook.com/sharer/sharer.php?u=${encoded}`
      break
  }

  window.open(url, '_blank')
}

function copyToClipboard() {
  const jokeText = `${props.joke.setup} ${props.joke.punchline}`
  navigator.clipboard.writeText(jokeText)
  navigator.clipboard.writeText(jokeText)
    .then(() => {
      alert(SHARE_LABELS.copiedMessage)
    })
    .catch((error) => {
      console.error('Failed to copy joke to clipboard:', error)
    })
}

const shareOptions = computed<ShareOption[]>(() => [
  {
    label: SHARE_LABELS.twitter,
    icon: 'mdi-twitter',
    color: '#1DA1F2',
    action: () => share(SHARE_LABELS.twitter)
  },
  {
    label: SHARE_LABELS.whatsapp,
    icon: 'mdi-whatsapp',
    color: '#25D366',
    action: () => share(SHARE_LABELS.whatsapp)
  },
  {
    label: SHARE_LABELS.facebook,
    icon: 'mdi-facebook',
    color: '#1877F2',
    action: () => share(SHARE_LABELS.facebook)
  },
  {
    label: SHARE_LABELS.clipboard,
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

.emoji-animate {
  animation: bounceIn 0.6s ease-in-out;
  display: inline-block;
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}

</style>