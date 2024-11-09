import { FormikState, useFormik } from 'formik'
import { ChangeEvent } from 'react'
import { Container, Form, Message } from 'semantic-ui-react'
import { SPButton, SPHeader, SPInput, SPText } from 'src/components'
import { styles } from 'src/styles'
import * as Yup from 'yup'
import { useForgotPasswordMutation } from './auth.hooks'

const ForgotPasswordValidatonSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
})

type Props = {
  form: FormikState<ForgotPasswordForm>
  onChangeEmail: (e: ChangeEvent<HTMLInputElement>) => void
  onNotifyForgotPassword: VoidFunction
}
function ForgotPasswordForm(props: Props) {
  const emailError = props.form.touched.email && !!props.form.errors.email

  return (
    <Form
      data-testid="forgot-password-form"
      className="flex-column bordered p-1r"
      onSubmit={props.onNotifyForgotPassword}
    >
      <Form.Field error={emailError}>
        <label htmlFor="forgot-password-email">Email</label>
        <SPInput
          id="forgot-password-email"
          data-testid="forgot-password-form-email-input"
          type="email"
          placeholder="Enter email here"
          value={props.form.values.email}
          onChange={props.onChangeEmail}
        />
        {emailError && (
          <SPText
            data-testid="forgot-password-form-email-error"
            style={styles['mt-0.5r']}
          >
            {props.form.errors.email}
          </SPText>
        )}
      </Form.Field>
      <SPButton
        data-testid="forgot-password-form-btn"
        className="align-self-end"
        type="submit"
        disabled={emailError}
      >
        Send
      </SPButton>
    </Form>
  )
}

export default function ForgotPassword() {
  const forgotPasswordMutation = useForgotPasswordMutation()

  const form = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: ForgotPasswordValidatonSchema,
    onSubmit: (data: ForgotPasswordForm) => forgotPasswordMutation.mutate(data),
  })

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('email', e.target.value)
  }

  const handleNotifyForgotPassword = () => {
    form.submitForm()
  }

  const renderForgotPasswordComponent = () => {
    const commonProps = {
      form: form,
      onChangeEmail: handleChangeEmail,
      onNotifyForgotPassword: handleNotifyForgotPassword,
    }

    switch (forgotPasswordMutation.status) {
      case 'idle':
      case 'loading': {
        return <ForgotPasswordForm {...commonProps} />
      }
      case 'error': {
        return (
          <>
            <Message negative>Unable to send email</Message>
            <ForgotPasswordForm {...commonProps} />
          </>
        )
      }
      case 'success': {
        return (
          <Message positive>
            An email with a reset link has been sent to you.
          </Message>
        )
      }
    }
  }
  return (
    <Container data-testid="forgot-password-page">
      <div className="justify-space-between bordered p-1r mb-1r">
        <SPHeader as="h1">Spaced Reps</SPHeader>
      </div>

      {renderForgotPasswordComponent()}
    </Container>
  )
}
