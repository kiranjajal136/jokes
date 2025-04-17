<template>
  <v-card class="mb-4 pa-4 d-flex flex-column h-100" elevation="2" transition="slide-y-transition">
    <v-card-title class="text-h6 text-wrap">
      {{ joke.setup }}
    </v-card-title>

    <v-card-subtitle>
      {{ joke.punchline }}
    </v-card-subtitle>

    <v-card-text class="flex-grow-1">
      <div class="text-caption text-grey">
        Category: <strong>{{ joke.type }}</strong>
      </div>
      <div class="rating-row d-flex align-center mt-2">
        <RatingStars
          :rating="joke.rating ?? 0"
          @rate="(r) => $emit('rate', r)"
        />
        <div
          v-if="(joke?.rating ?? 0) > 0"
          class="emoji-animate text-h4 ml-3"
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
            class="d-flex align-center"
            @click="option.action"
          >
            <v-icon :color="option.color" start>{{ option.icon }}</v-icon>
            <v-list-item-title>{{ option.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        variant="outlined"
        color="error"
        prepend-icon="mdi-delete"
        data-test-id="delete-joke"
        @click="$emit('remove')"
      >
        Delete
      </v-btn>
    </v-card-actions>
    
  </v-card>
</template>
<script setup lang="ts">
import { ShareLabels, type Joke, RatingThresholds, type ShareOption } from '~/types/joke'

const props = defineProps<{
  joke: Joke
}>()

const emojiForRating = computed(() => {
  const rating = props.joke?.rating

  if (!rating) return ''

  if (rating >= RatingThresholds.High) return '😊'
  if (rating === RatingThresholds.Medium) return '😐'
  if (rating <= RatingThresholds.Low) return '😢'
  return ''
})

function share(platform: string) {
  const jokeText = `${props.joke.setup} ${props.joke.punchline}`
  let url = ''

  const encoded = encodeURIComponent(jokeText)

  switch (platform) {
    case ShareLabels.Twitter:
      url = `https://twitter.com/intent/tweet?text=${encoded}`
      break
    case ShareLabels.Whatsapp:
      url = `https://api.whatsapp.com/send?text=${encoded}`
      break
    case ShareLabels.Facebook:
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
      alert(ShareLabels.CopiedMessage)
    })
    .catch((error) => {
      console.error('Failed to copy joke to clipboard:', error)
    })
}

const shareOptions = computed<ShareOption[]>(() => [
  {
    label: ShareLabels.Twitter,
    icon: 'mdi-twitter',
    color: '#1DA1F2',
    action: () => share(ShareLabels.Twitter)
  },
  {
    label: ShareLabels.Whatsapp,
    icon: 'mdi-whatsapp',
    color: '#25D366',
    action: () => share(ShareLabels.Whatsapp)
  },
  {
    label: ShareLabels.Facebook,
    icon: 'mdi-facebook',
    color: '#1877F2',
    action: () => share(ShareLabels.Facebook)
  },
  {
    label: ShareLabels.Clipboard,
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