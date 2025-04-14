export interface Joke {
  _id: string
  setup: string
  punchline: string
  type: string
  rating?: number
}

export interface ShareOption {
  label: string
  icon: string
  color: string
  action: () => void
}