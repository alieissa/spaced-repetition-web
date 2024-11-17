/** @format */

import { useFormik } from 'formik'
import * as _ from 'lodash'
import { MouseEventHandler } from 'react'
import 'semantic-ui-css/semantic.min.css'
import {
  DropdownProps,
  Form,
  Header,
  Popup,
  PopupProps,
} from 'semantic-ui-react'
import 'src/App.css'
import { styles } from 'src/styles'

interface Props {
  id: string
  deckId?: string
  decks?: ReadonlyArray<Deck>
  open: boolean
  easiness: number
  quality: number
  interval: number
  trigger: PopupProps['trigger']
  onSave: (data: Pick<Props, 'easiness' | 'quality' | 'interval'>) => void
  onCancel: MouseEventHandler
}

export default function Settings(props: Readonly<Props>) {
  return (
    <Popup
      basic
      on="click"
      open={props.open}
      content={
        <>
          <Header>Settings</Header>
          {/* Form content is the stateful part so unmount it when closing. Unmounting destroys local state */}
          {props.open && <SettingsFormContent {..._.omit(props, 'open')} />}
        </>
      }
      trigger={props.trigger}
      onClose={props.onCancel}
    />
  )
}

function SettingsFormContent(props: Omit<Props, 'open'>) {
  const formik = useFormik({
    initialValues: {
      // Not used in inputs but passed to component calling it to identify to which widget
      // the settings belong
      id: props.id,
      deckId: props.deckId,
      easiness: props.easiness,
      quality: props.quality,
      interval: props.interval,
    },
    onSubmit: props.onSave,
  })

  return (
    <Form onSubmit={formik.handleSubmit}>
      {props.deckId && props.decks && (
        <Form.Select
          name="deckId"
          label="Deck"
          options={_.map(props.decks, (d) => ({ text: d.name, value: d.id }))}
          value={formik.values.deckId}
          onChange={(__, data: DropdownProps) => {
            formik.setFieldValue('deckId', data.value)
          }}
        />
      )}
      <Form.Input
        id="easiness"
        name="easiness"
        label="Easiness"
        type="number"
        min="1"
        max="5"
        step="0.5"
        value={formik.values.easiness}
        onChange={formik.handleChange}
      />
      <Form.Input
        id="quality"
        name="quality"
        label="Quality"
        type="number"
        min="1"
        max="5"
        step="0.5"
        value={formik.values.quality}
        onChange={formik.handleChange}
      />
      <Form.Input
        id="interval"
        name="interval"
        label="Interval"
        value={formik.values.interval}
        type="number"
        min="1"
        onChange={formik.handleChange}
      />
      <Form.Group style={{ ...styles.justifyEnd, ...styles.m0 }}>
        <Form.Button basic onClick={props.onCancel}>
          Cancel
        </Form.Button>
        <Form.Button color="green" type="submit">
          Save
        </Form.Button>
      </Form.Group>
    </Form>
  )
}
