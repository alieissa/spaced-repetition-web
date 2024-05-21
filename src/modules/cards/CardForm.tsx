/** @format */
import * as _ from 'lodash'
import { useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Form, Icon } from 'semantic-ui-react'
import 'src/App.css'
import { SPButtonIcon, SPFormInput, SPList, SPListItem } from 'src/components'
import { styles } from 'src/styles'
import { NCards } from './cards.types'

export type CardFormProps = NCards.Card & {
  areAnswersVisible: boolean
  actions?: JSX.Element
  getQuestionError?: () => boolean
  getAnswerError?: (index: number) => boolean
  onChangeQuestion: (question: string) => void
  onChangeAnswer: (id: string, content: string) => void
  onDeleteAnswer: (id: string) => void
  onAddAnswer: VoidFunction
}

export default function CardForm(props: CardFormProps) {
  const [areAnswersVisible, setAreAnswersVisible] = useState(
    !!props.areAnswersVisible,
  )

  return (
    <Form className="w-full bordered">
      <div className="flex-row-reverse">
        <Icon
          data-testid="view-answers-btn"
          name={!areAnswersVisible ? 'arrow down' : 'arrow up'}
          onClick={() => setAreAnswersVisible(!areAnswersVisible)}
        />
      </div>
      <SPList horizontal className="flex" style={styles.flex}>
        <SPListItem className="flex-1">
          <SPFormInput
            data-testid="question-content"
            placeholder="Enter question here"
            className="w-full"
            value={props.question}
            error={props.getQuestionError ? props.getQuestionError() : _.noop}
            onChange={(e: any) => {
              props.onChangeQuestion(e.target.value)
            }}
          />
        </SPListItem>
        <SPListItem className="flex-1">
          {areAnswersVisible && (
            <SPList style={styles.p0}>
              {props.answers.map((answer, index) => (
                <SPListItem
                  key={answer.id}
                  className="flex"
                  style={styles.flex}
                >
                  <SPFormInput
                    data-testid={`answer-content-${index}`}
                    value={answer.content}
                    placeholder="Enter answer here"
                    className="w-full"
                    error={
                      props.getAnswerError
                        ? props.getAnswerError(index)
                        : _.noop
                    }
                    onChange={(e: any) => {
                      props.onChangeAnswer(answer.id, e.target.value || '')
                    }}
                  />

                  <SPButtonIcon
                    size="small"
                    style={styles.bgWhite}
                    disabled={_.size(props.answers) === 1}
                    icon="x"
                    onClick={() => {
                      props.onDeleteAnswer(answer.id)
                    }}
                  />
                </SPListItem>
              ))}
              <SPListItem style={styles.textAlignRight}>
                <SPButtonIcon
                  size="small"
                  style={styles.bgWhite}
                  icon="plus"
                  onClick={props.onAddAnswer}
                />
              </SPListItem>
            </SPList>
          )}
        </SPListItem>
      </SPList>
    </Form>
  )
}
