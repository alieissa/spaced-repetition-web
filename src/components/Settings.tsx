/** @format */

import { useFormik } from 'formik'
import * as _ from 'lodash'
import React, { MouseEventHandler } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Form, Header, Popup, PopupProps } from 'semantic-ui-react'
import { styles } from 'src/styles'
import '../App.css'

interface Props {
  id: string
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
      content={
        props.open && (
          <>
            <Header>Settings</Header>
            <SettingsFormContent {..._.omit(props, 'open')} />
          </>
        )
      }
      trigger={props.trigger}
    />
  )
}

function SettingsFormContent(props: Omit<Props, 'open'>) {
  const formik = useFormik({
    initialValues: {
      // Not used in inputs but passed to component calling it to identify to which widget
      // the settings belong
      id: props.id,
      easiness: props.easiness,
      quality: props.quality,
      interval: props.interval,
    },
    onSubmit: props.onSave,
  })

  return (
    <Form onSubmit={formik.handleSubmit}>
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
