/** @format */
import * as _ from 'lodash'

export namespace Answers {
  export type PostRequest = Settings & {
    readonly content: string
  }
  export function PostRequest(req: Partial<PostRequest>): PostRequest {
    return {
      easiness: req.easiness || 1,
      quality: req.quality || 1,
      interval: req.interval || 1,
      content: req.content || 'new answer',
    }
  }

  export type Answer = PostRequest & {
    readonly id: string
  }
  export function Answer(
    a: Optional<Answer, 'easiness' | 'quality' | 'interval'>,
  ): Answer {
    return {
      easiness: a.easiness || 1,
      quality: a.quality || 1,
      interval: a.interval || 1,
      ...a,
    }
  }
  /**
   * If a has all the fields of an Answer and nothing else
   * then it is detected as of type Answer
   */
  export function isAnswer(a: object): a is Answer {
    return _.isEmpty(
      _.xor(
        _.sortBy(['easiness', 'quality', 'interval', 'content', 'id']),
        _.sortBy(_.keys(a)),
      ),
    )
  }
}
