/** @format */
import * as _ from 'lodash'

export namespace NAnswers {
  export type Answer = {
    id: string
    content: string
  }
  
  export type Initial = {
    __type__: 'INITIAL'
    id: string
    content: string
  }
  export function Initial(req: Partial<Initial>): Initial {
    return {
      __type__: 'INITIAL',
      id: _.uniqueId(),
      content: req.content || '',
    }
  }

    export type Formed = {
      __type__: 'FORMED'
      id: string
      content: string
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
