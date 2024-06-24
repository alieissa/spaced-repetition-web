import { FormikState, useFormik } from 'formik'
import { ChangeEvent } from 'react'
import { Container, Form, Message } from 'semantic-ui-react'
import { SPButton, SPHeader, SPInput, SPText } from 'src/components'
import { styles } from 'src/styles'
import { async } from 'src/utils'
import * as Yup from 'yup'
import { useForgotPassword } from './auth.hooks'
import { NAuth } from './auth.types'

const ForgotPasswordValidatonSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
})

type Props = {
  form: FormikState<NAuth.ForgotPasswordForm>
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
        <label htmlFor="email">Email</label>
        <SPInput
          data-testid="forgot-password-form-email-input"
          type="email"
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
  const [notifyForgotPasswordStatus, notifyForgotPassword] = useForgotPassword()

  const form = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: ForgotPasswordValidatonSchema,
    onSubmit: notifyForgotPassword,
  })

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('email', e.target.value)
  }

  const handleNotifyForgotPassword = () => {
    form.submitForm()
  }

  const commonProps = {
    form: form,
    onChangeEmail: handleChangeEmail,
    onNotifyForgotPassword: handleNotifyForgotPassword,
  }
  return (
    <Container>
      <div className="justify-space-between bordered p-1r mb-1r">
        <SPHeader as="h1">Spaced Reps</SPHeader>
      </div>

      {async.match(notifyForgotPasswordStatus)({
        Untriggered: () => <ForgotPasswordForm {...commonProps} />,
        Loading: () => <ForgotPasswordForm {...commonProps} />,
        Failure: () => (
          <>
            <div data-testid="forgot-password-form-error">
              <Message negative>Unable to send email</Message>
            </div>
            <ForgotPasswordForm {...commonProps} />
          </>
        ),
        Success: () => (
          <div data-testid="forgot-password-form-success">
            <Message positive>
              An email with a reset link has been sent to you.
            </Message>
          </div>
        ),
      })}
    </Container>
  )
}
