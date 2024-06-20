import { FormikState, useFormik } from 'formik'
import { ChangeEvent } from 'react'
import { Form } from 'semantic-ui-react'
import { SPButton, SPInput, SPText } from 'src/components'
import { styles } from 'src/styles'
import { async } from 'src/utils'
import * as Yup from 'yup'
import { useForgotPassword } from './auth.hooks'

const ForgotPasswordValidatonSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
})

type Props = {
  form: FormikState<{ email: string }>
  onChangeEmail: (e: ChangeEvent<HTMLInputElement>) => void
  onNotifyForgotPassword: VoidFunction
}
function ForgotPasswordForm(props: Props) {
  const emailError = props.form.touched.email && !!props.form.errors.email

  return (
    <Form
      data-testid="forgot-password-form"
      onSubmit={props.onNotifyForgotPassword}
    >
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
      <SPButton data-testid="forgot-password-form-btn" type="submit">
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
  return async.match(notifyForgotPasswordStatus)({
    Untriggered: () => <ForgotPasswordForm {...commonProps} />,
    Loading: () => <ForgotPasswordForm {...commonProps} />,
    Failure: () => (
      <>
        <div data-testid="forgot-password-form-error">failure</div>
        <ForgotPasswordForm {...commonProps} />
      </>
    ),
    Success: () => (
      <div data-testid="forgot-password-form-success">success</div>
    ),
  })
}
