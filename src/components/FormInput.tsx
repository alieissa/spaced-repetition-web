/** @format */

import { FormField, FormFieldProps } from 'semantic-ui-react'
import SPInput from './Input'

const styles = {
  border: 'none',
  borderRadius: 'none',
}
export default function SPFormInput(props: FormFieldProps) {
  return <FormField control={SPInput} {...props} />
}
