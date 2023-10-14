/** @format */

import { FormikHelpers, FormikState, useFormik } from 'formik'
import { noop } from 'lodash'
import { ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Loader, Message, Segment } from 'semantic-ui-react'
import { async } from 'src/utils'
import * as Yup from 'yup'
import useLogin from './login.hooks'
import { NLogin } from './login.types'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
})
type Props = {
  form: FormikState<NLogin.User>
  onLogin?: (data: NLogin.User) => void
  onChangeEmail: (e: ChangeEvent<HTMLInputElement>) => void
  onChangePassword: (e: ChangeEvent<HTMLInputElement>) => void
}
const LoginComponent = (props: Props) => {
  const emailError = props.form.touched.email && !!props.form.errors.email
  const passwordError =
    props.form.touched.password && !!props.form.errors.password

  return (
    <Form onSubmit={props.onLogin ?? noop}>
      <Form.Field error={emailError}>
        <label>Email</label>
        <input
          title="email"
          disabled={props.form.isSubmitting}
          placeholder="Email"
          value={props.form.values.email}
          onChange={props.onChangeEmail}
        />
      </Form.Field>
      <Form.Field error={passwordError}>
        <label>Password</label>
        <input
          title="password"
          disabled={props.form.isSubmitting}
          placeholder="Password"
          type="password"
          value={props.form.values.password}
          onChange={props.onChangePassword}
        />
      </Form.Field>
      <Button type="submit" disabled={props.form.isSubmitting}>
        Login
      </Button>
    </Form>
  )
}

function Login() {
  const { status, login } = useLogin()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleLogin = (
    data: NLogin.User,
    { setSubmitting }: FormikHelpers<NLogin.User>,
  ) => {
    dispatch({
      type: 'Login',
    })
    login(data).then((result) => {
      setSubmitting(false)
      dispatch({ type: 'LoggedIn', result })
    })
  }

  const form = useFormik({
    initialValues: {
      password: '',
      email: '',
    },
    validationSchema: LoginSchema,
    onSubmit: handleLogin ?? noop,
  })

  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('email', e.target.value)
  }

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('password', e.target.value)
  }

  const commonProps = {
    form,
    onChangeEmail: handleChangeEmail,
    onChangePassword: handleChangePassword,
  }

  return async.match(status)({
    Untriggered: () => (
      <Segment data-testid="login-form">
        <LoginComponent onLogin={form.submitForm} {...commonProps} />
      </Segment>
    ),
    Loading: () => (
      <Segment data-testid="login-form-loading">
        <Loader active></Loader>
        <LoginComponent {...commonProps} />
      </Segment>
    ),
    Failure: () => (
      <Segment data-testid="login-form-error">
        <Message negative>
          <Message.Header>Login failed</Message.Header>
          <p>Please make sure email and/or password are correct</p>
        </Message>
        <LoginComponent {...commonProps} />
      </Segment>
    ),
    Success: () => {
      navigate('/')
      return null
    },
  })
}

export default Login
