/** @format */

import { FormikHelpers, FormikState, useFormik } from 'formik'
import { noop } from 'lodash'
import { ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'
import { Button, Form, Loader, Message, Segment } from 'semantic-ui-react'
import { async } from 'src/utils'
import * as Yup from 'yup'
import { useSignUp } from './signup.hooks'
import { NSignup } from './signup.types'

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
})
type Props = {
  form: FormikState<NSignup.User>
  onSignup?: (data: NSignup.User) => void
  onChangeEmail: (e: ChangeEvent<HTMLInputElement>) => void
  onChangePassword: (e: ChangeEvent<HTMLInputElement>) => void
}
const SignupComponent = (props: Props) => {
  const emailError = props.form.touched.email && !!props.form.errors.email
  const passwordError =
    props.form.touched.password && !!props.form.errors.password

  return (
    <Form onSubmit={props.onSignup ?? noop}>
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
        Submit
      </Button>
    </Form>
  )
}

function Signup() {
  const { status, signup } = useSignUp()

  const dispatch = useDispatch()
  const handleSignUp = (
    data: NSignup.User,
    { setSubmitting }: FormikHelpers<NSignup.User>,
  ) => {
    dispatch({
      type: 'Signup',
    })
    signup(data).then((result) => {
      setSubmitting(false)
      dispatch({ type: 'Signedup', result })
    })
  }

  const form = useFormik({
    initialValues: {
      password: '',
      email: '',
    },
    validationSchema: SignUpSchema,
    onSubmit: handleSignUp ?? noop,
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
      <Segment data-testid="signup-form">
        <SignupComponent onSignup={form.submitForm} {...commonProps} />
      </Segment>
    ),
    Loading: () => (
      <Segment data-testid="signup-form-loading">
        <Loader active></Loader>
        <SignupComponent {...commonProps} />
      </Segment>
    ),
    Failure: () => (
      <Segment data-testid="signup-form-error">
        <Message negative>
          <Message.Header>Signup failed</Message.Header>
          <p>Please try again.</p>
        </Message>
        <SignupComponent {...commonProps} />
      </Segment>
    ),
    Success: () => (
      <Segment data-testid="signup-form-successful">
        <Message positive>
          <Message.Header>Signup successful</Message.Header>
          <p>An email has been sent to you.</p>
        </Message>
      </Segment>
    ),
  })
}

export default Signup
