/** @format */
import * as _ from 'lodash'
import { Settings } from 'src/types'

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
  export type Initial = PostRequest & {
    // __key__ is only used as a react key when displaying them
    readonly __key__: string
  }
  export function Initial(req: Partial<Initial>): Initial {
    return {
      __key__: _.uniqueId(),
      easiness: req.easiness || 1,
      quality: req.quality || 1,
      interval: req.interval || 1,
      content: req.content || '',
    }
  }
  export function toPostRequest(initial: Initial): PostRequest {
    return _.omit(initial, '__key__')
  }

  export type Answer = PostRequest & {
    readonly id: string
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
