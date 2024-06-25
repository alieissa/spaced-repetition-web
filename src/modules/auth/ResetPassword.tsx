import { FormikState, useFormik } from 'formik'
import { ChangeEvent, useEffect } from 'react'
import { Container, Form, Message } from 'semantic-ui-react'
import { SPButton, SPHeader, SPInput, SPText } from 'src/components'
import { styles } from 'src/styles'
import { async } from 'src/utils'
import * as Yup from 'yup'
import { useResetPassword } from './auth.hooks'
import { NAuth } from './auth.types'

const ResetPasswordValidatonSchema = Yup.object().shape({
  password: Yup.string()
    .required('Required')
    .min(5, 'Password must be at least 5 characters.'),
  confirmededPassword: Yup.string().oneOf(
    [Yup.ref('password')],
    'Passwords must match',
  ),
})

type Props = {
  form: FormikState<NAuth.ResetPasswordForm>
  onChangePassword: (e: ChangeEvent<HTMLInputElement>) => void
  onChangeConfirmedPassword: (e: ChangeEvent<HTMLInputElement>) => void
  onResetPassword: VoidFunction
}
function ResetPasswordForm(props: Props) {
  const passwordError =
    props.form.touched.password && !!props.form.errors.password
  const confirmedPasswordError =
    props.form.touched.confirmedPassword &&
    !!props.form.errors.confirmedPassword
  return (
    <Form
      data-testid="reset-password-form"
      className="flex-column bordered p-1r"
      onSubmit={props.onResetPassword}
    >
      <Form.Field error={passwordError || confirmedPasswordError}>
        <label htmlFor="rest-password-password-input">Password</label>
        <SPInput
          id="rest-password-password-input"
          data-testid="reset-password-form-password-input"
          title="password"
          disabled={props.form.isSubmitting}
          placeholder="Password"
          type="password"
          value={props.form.values.password}
          onChange={props.onChangePassword}
        />
        {passwordError && (
          <SPText
            data-testid="reset-password-form-password-error"
            style={styles['mt-0.5rem']}
          >
            {props.form.errors.password}
          </SPText>
        )}
      </Form.Field>
      <Form.Field error={confirmedPasswordError}>
        <label htmlFor="reset-password-confirm-password-input">
          Confirm password
        </label>
        <SPInput
          id="reset-password-confirm-password-input"
          data-testid="reset-password-form-confirmed-password-input"
          title="confirm password"
          disabled={props.form.isSubmitting}
          placeholder="Confirm password"
          type="password"
          value={props.form.values.confirmedPassword}
          onChange={props.onChangeConfirmedPassword}
        />
        {confirmedPasswordError && (
          <SPText
            data-testid="reset-password-form-confirmed-password-error"
            style={styles['mt-0.5rem']}
          >
            {props.form.errors.confirmedPassword}
          </SPText>
        )}
      </Form.Field>
      <SPButton
        data-testid="reset-password-form-btn"
        className="align-self-end"
        type="submit"
        disabled={passwordError || confirmedPasswordError}
      >
        Submit
      </SPButton>
    </Form>
  )
}

export default function ResetPassword() {
  const [resetPasswordStatus, resetPassword] = useResetPassword()

  const form = useFormik({
    initialValues: {
      password: '',
      confirmedPassword: '',
    },
    validationSchema: ResetPasswordValidatonSchema,
    onSubmit: (values: NAuth.ResetPasswordForm) =>
      resetPassword({ password: values.password }),
  })

  useEffect(() => {
    form.setSubmitting(resetPasswordStatus.type === 'Loading')
  }, [resetPasswordStatus])

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('password', e.target.value)
  }

  const handleChangeConfirmedPassword = (e: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('confirmedPassword', e.target.value)
  }

  const commonProps = {
    form: form,
    onChangePassword: handleChangePassword,
    onChangeConfirmedPassword: handleChangeConfirmedPassword,
    onResetPassword: form.submitForm,
  }
  return (
    <Container>
      <div className="justify-space-between bordered p-1r mb-1r">
        <SPHeader as="h1">Spaced Reps</SPHeader>
      </div>

      {async.match(resetPasswordStatus)({
        Untriggered: () => <ResetPasswordForm {...commonProps} />,
        Loading: () => <ResetPasswordForm {...commonProps} />,
        Failure: () => (
          <>
            <div data-testid="reset-password-form-error">
              <Message negative>Unable to reset password</Message>
            </div>
            <ResetPasswordForm {...commonProps} />
          </>
        ),
        Success: () => (
          <div data-testid="reset-password-form-success">
            <Message positive>Your password has been reset</Message>
          </div>
        ),
      })}
    </Container>
  )
}
