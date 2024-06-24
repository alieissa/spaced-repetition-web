/** @format */

import { FormikState, useFormik } from 'formik'
import { ChangeEvent, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Form, Loader, Message } from 'semantic-ui-react'
import { SPButton, SPCheckbox, SPHeader, SPInput, SPText } from 'src/components'
import { styles } from 'src/styles'
import { async } from 'src/utils'
import * as Yup from 'yup'
import useLogin from './auth.hooks'
import { NAuth } from './auth.types'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
})
type Props = {
  form: FormikState<NAuth.UserForm>
  onLogin: (data: NAuth.UserForm) => void
  onChangeEmail: (e: ChangeEvent<HTMLInputElement>) => void
  onChangePassword: (e: ChangeEvent<HTMLInputElement>) => void
  onChangeRememberMe: VoidFunction
}
const LoginComponent = (props: Props) => {
  const emailError = props.form.touched.email && !!props.form.errors.email
  const passwordError =
    props.form.touched.password && !!props.form.errors.password

  return (
    <>
      <Form
        onSubmit={() => props.onLogin(props.form.values)}
        className="flex-column bordered p-1r"
      >
        <Form.Field error={emailError}>
          <label>Email</label>
          <SPInput
            data-testid="login-form-email-input"
            title="email"
            disabled={props.form.isSubmitting}
            placeholder="Email"
            value={props.form.values.email}
            onChange={props.onChangeEmail}
          />
          {emailError && (
            <SPText
              data-testid="login-form-email-error"
              style={styles['mt-0.5r']}
            >
              {props.form.errors.email}
            </SPText>
          )}
        </Form.Field>
        <Form.Field error={passwordError}>
          <label>Password</label>
          <SPInput
            data-testid="login-form-password-input"
            title="password"
            disabled={props.form.isSubmitting}
            placeholder="Password"
            type="password"
            value={props.form.values.password}
            onChange={props.onChangePassword}
          />
          <div className="flex-row-reverse" style={styles['mt-0.5r']}>
            <Link
              data-testid="login-form-forgot-password-link"
              to="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
          {passwordError && (
            <SPText
              data-testid="login-form-password-error"
              style={styles['mt-0.5r']}
            >
              {props.form.errors.password}
            </SPText>
          )}
        </Form.Field>
        <footer className="align-center justify-space-between">
          <div className="align-center">
            <SPCheckbox
              checked={props.form.values.rememberMe}
              onChange={props.onChangeRememberMe}
            />
            <span className="ml-fourth-r">Remember Me?</span>
          </div>
          <SPButton
            type="submit"
            disabled={props.form.isSubmitting}
            className="align-self-end"
          >
            Login
          </SPButton>
        </footer>
      </Form>
    </>
  )
}

function Login() {
  const navigate = useNavigate()
  const [status, login, resetLogin] = useLogin()

  const form = useFormik({
    initialValues: {
      password: '',
      email: '',
      rememberMe: true,
    },
    validationSchema: LoginSchema,
    onSubmit: (data: NAuth.UserForm) => login(data),
  })

  // Very important: Makes sure that when login is mounted
  // as a result of a redirect from the app the login status
  // is not success. Without this cleanup code we would have
  // an infinite loop
  useEffect(() => {
    return () => resetLogin()
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    form.setSubmitting(status.type === 'Loading')
    if (status.type !== 'Success') {
      return
    }
    navigate('/')
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.type])

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('email', e.target.value)
  }

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('password', e.target.value)
  }

  const handleChangeRememberMe = () => {
    form.setFieldValue('rememberMe', !form.values.rememberMe)
  }

  const handleSignupClick = () => navigate('/signup')

  const commonProps = {
    form,
    onChangeEmail: handleChangeEmail,
    onChangePassword: handleChangePassword,
    onChangeRememberMe: handleChangeRememberMe,
    onLogin: form.submitForm,
  }

  return (
    <Container>
      <div className="justify-space-between bordered p-1r mb-1r">
        <SPHeader as="h1">Spaced Reps</SPHeader>
        <div>
          <SPButton
            data-testid="login-form-signup-button"
            size="medium"
            color="blue"
            onClick={handleSignupClick}
          >
            Signup
          </SPButton>
        </div>
      </div>
      {async.match(status)({
        Untriggered: () => (
          <div data-testid="login-form">
            <LoginComponent {...commonProps} />
          </div>
        ),
        Loading: () => (
          <div data-testid="login-form-loading">
            <Loader active />
            <LoginComponent {...commonProps} />
          </div>
        ),
        Failure: () => (
          <div data-testid="login-form-error">
            <Message negative>
              <Message.Header>Login failed</Message.Header>
              <p>Please make sure email and/or password are correct</p>
            </Message>
            <LoginComponent {...commonProps} />
          </div>
        ),
        Success: () => null,
      })}
    </Container>
  )
}

export default Login
