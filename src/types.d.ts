/** @format */
type Optional<T, K> = Omit<T, K> & Partial<Pick<T, K>>

type WithItem<T, V extends keyof I, I> = T & Pick<I, V>
interface Settings {
  readonly easiness: number
  readonly quality: number
  readonly interval: number
  readonly createdAt?: number
  readonly updatedAt?: number
}
type WithSettings<T, V extends keyof Settings = keyof Settings> = T &
  Pick<Settings, V>

type AnswerPostRequest = Settings & {
  readonly content: string
}
function AnswerPostRequest(req: Partial<AnswerPostRequest>): AnswerPostRequest {
  return {
    easiness: values.easiness || 1,
    quality: values.quality || 1,
    interval: values.interval || 1,
    content: values.content || 'new answer',
  }
}

type Answer = AnswerPostRequest & {
  readonly id: string
}
function Answer(
  a: Optional<Answer, 'easiness' | 'quality' | 'interval'>,
): Answer {
  return {
    easiness: values.easiness || 1,
    quality: values.quality || 1,
    interval: values.interval || 1,
    content: values.content,
  }
}
/**
 * If a has all the fields of an Answer and nothing else
 * then it is detected as of type Answer
 */
function isAnswer(a: unknown): a is Answer {
  return _.isEmpty(
    _.sortBy(['easiness', 'quality', 'interval', 'content', 'id']),
    _.sortBy(_.keys(a)),
  )
}

type RootState = {
  decks: DecksState
}
