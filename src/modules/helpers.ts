/** @format */
export const createAnswer: (values: Partial<Answer>) => Answer = (values) => {
  return {
    easiness: values.easiness || 1,
    quality: values.quality || 1,
    interval: values.interval || 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    content: values.content || '',
  }
}

export const createDeck: (values?: Partial<Deck>) => Deck = (values) => {
  return {
    id: values?.id || '-1',
    name: values?.name || '',
    easiness: values?.easiness || 1,
    quality: values?.quality || 1,
    interval: values?.interval || 1,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    questions: [],
  }
}
