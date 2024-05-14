/** @format */
import * as _ from 'lodash'
import { useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Form, Icon } from 'semantic-ui-react'
import 'src/App.css'
import { SPButtonIcon, SPInput, SPList, SPListItem } from 'src/components'
import { NAnswers } from 'src/modules/answers'
import { styles } from 'src/styles'

export type CardFormProps = {
  id: string
  question: string
  answers: NAnswers.Answer[]
  onChangeQuestion: (question: string) => void
  onChangeAnswer: (id: string, content: string) => void
  onDeleteAnswer: (id: string) => void
  onAddAnswer: VoidFunction
}

export default function CardForm(props: CardFormProps) {
  const [areAnswersVisible, setAreAnswersVisible] = useState(false)

  return (
    <Form className="w-full">
      <div className="flex-row-reverse">
        <Icon
          data-testid="view-answers-btn"
          name={!areAnswersVisible ? 'arrow down' : 'arrow up'}
          onClick={() => setAreAnswersVisible(!areAnswersVisible)}
        />
      </div>
      <SPList horizontal className="flex" style={styles.flex}>
        <SPListItem className="flex-1">
          <SPInput
            name="question-content"
            placeholder="Enter question here"
            className="w-full"
            value={props.question}
            onChange={(e) => {
              props.onChangeQuestion(e.target.value)
            }}
          />
        </SPListItem>
        <SPListItem className="flex-1">
          {areAnswersVisible && (
            <SPList style={styles.p0}>
              {props.answers.map((answer) => (
                <SPListItem
                  key={answer.id}
                  className="flex"
                  style={styles.flex}
                >
                  <SPInput
                    value={answer.content}
                    placeholder="Enter answer here"
                    className="w-full"
                    name="answer-content"
                    onChange={(e) => {
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
                  onClick={() => {
                    props.onAddAnswer()
                  }}
                />
              </SPListItem>
            </SPList>
          )}
        </SPListItem>
      </SPList>
    </Form>
  )
}
