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
export const enum JokeLabels {
  AddJoke = 'Add Joke',
  AddNewJoke = 'Add a New Joke',
  Setup = 'Setup',
  Punchline = 'Punchline',
  Category = 'Category',
  Save = 'Save',
  Cancel = 'Cancel',
}

export const enum JokeListLabels {
  SortByRating = 'Sort by Rating',
}

export const enum ShareLabels {
  Twitter = 'Twitter',
  Whatsapp = 'WhatsApp',
  Facebook = 'Facebook',
  Clipboard = 'Copy to Clipboard',
  CopiedMessage = 'Joke copied to clipboard!',
}

export const enum RatingThresholds {
  High = 4,
  Medium = 3,
  Low = 2,
}

export const enum ErrorMessages {
  FillAllFields = 'Please fill in all fields before saving.',
  AddJokeFailed = 'Something went wrong while adding the joke.',
}

export const enum SortDirection {
  Ascending = 'asc',
  Descending = 'desc',
}