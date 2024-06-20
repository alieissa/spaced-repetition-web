import { useFormik } from 'formik'
import { Form } from 'semantic-ui-react'
import { SPButton, SPInput, SPText } from 'src/components'
import { styles } from 'src/styles'
import * as Yup from 'yup'

const ForgotPasswordValidatonSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
})
export default function ForgotPassword() {
  const form = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: ForgotPasswordValidatonSchema,
    onSubmit: (values) => console.log(values),
  })

  const handleOnEmailChange = () => {
    form.setFieldValue('email', form.values.email)
  }
  const emailError = form.touched.email && !!form.errors.email

  return (
    <Form data-testid="forgot-password-form" onSubmit={form.submitForm}>
      <SPInput
        data-testid="forgot-password-form-email-input"
        type="email"
        value={form.values.email}
        onChange={handleOnEmailChange}
      />
      {emailError && (
        <SPText
          data-testid="forgot-password-form-email-error"
          style={styles['mt-0.5r']}
        >
          {form.errors.email}
        </SPText>
      )}
      <SPButton data-testid="forgot-password-form-btn" type="submit">
        Send
      </SPButton>
    </Form>
  )
}
