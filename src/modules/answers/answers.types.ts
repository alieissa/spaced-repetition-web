/** @format */
import * as _ from 'lodash'

export namespace Answers {
  export type PostRequest =  {
    readonly content: string
  }
  export function PostRequest(req: PostRequest): PostRequest {
    return {
      content: req.content,
    }
  }
  export type Initial = PostRequest & {
    // __key__ is only used as a react key when displaying them
    readonly __key__: string
  }
  export function Initial(req: Partial<Initial>): Initial {
    return {
      __key__: _.uniqueId(),
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
