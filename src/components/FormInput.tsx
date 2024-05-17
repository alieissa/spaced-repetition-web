/** @format */

import { FormField, FormFieldProps } from 'semantic-ui-react'
import SPInput from './Input'

export default function SPFormInput(props: FormFieldProps) {
  return <FormField control={SPInput} {...props} />
}
