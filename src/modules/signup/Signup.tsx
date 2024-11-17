/** @format */

import { FormikState, useFormik } from 'formik'
import { ChangeEvent, useEffect } from 'react'
import { Container, Form, Loader, Message } from 'semantic-ui-react'
import { SPButton, SPHeader, SPInput, SPText } from 'src/components'
import { styles } from 'src/styles'
import * as Yup from 'yup'
import { useSignupMutation } from './signup.hooks'

type UserForm = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmedPassword: string
}
const UserFormSchema = Yup.object().shape({
  firstName: Yup.string(),
  lastName: Yup.string(),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
  confirmedPassword: Yup.string().required('Required'),
})
type Props = {
  form: FormikState<UserForm>
  onChangeFirstName: (e: ChangeEvent<HTMLInputElement>) => void
  onChangeLastName: (e: ChangeEvent<HTMLInputElement>) => void
  onChangeEmail: (e: ChangeEvent<HTMLInputElement>) => void
  onChangePassword: (e: ChangeEvent<HTMLInputElement>) => void
  onChangeConfirmedPassword: (e: ChangeEvent<HTMLInputElement>) => void
  onSignup: VoidFunction
}
const SignupComponent = (props: Props) => {
  const emailError = props.form.touched.email && !!props.form.errors.email
  const passwordError =
    props.form.touched.password && !!props.form.errors.password
  const confirmedPasswordError =
    props.form.touched.confirmedPassword &&
    !!props.form.errors.confirmedPassword

  return (
    <Form
      onSubmit={props.onSignup}
      className="flex-column bordered p-1r"
      name="signup-form"
    >
      <Form.Field>
        <label htmlFor="first name">First name</label>
        <SPInput
          data-testid="signup-form-first-name-input"
          title="first name"
          disabled={props.form.isSubmitting}
          placeholder="First name"
          value={props.form.values.firstName}
          onChange={props.onChangeFirstName}
        />
      </Form.Field>
      <Form.Field>
        <label>Last name</label>
        <SPInput
          data-testid="signup-form-last-name-input"
          title="last name"
          disabled={props.form.isSubmitting}
          placeholder="Last name"
          value={props.form.values.lastName}
          onChange={props.onChangeLastName}
        />
      </Form.Field>
      <Form.Field error={emailError}>
        <label>Email</label>
        <SPInput
          data-testid="signup-form-email-input"
          name="email"
          title="email"
          disabled={props.form.isSubmitting}
          placeholder="Email"
          value={props.form.values.email}
          onChange={props.onChangeEmail}
        />
        {emailError && (
          <SPText
            data-testid="signup-form-email-error"
            style={styles['mt-0.5rem']}
          >
            {props.form.errors.email}
          </SPText>
        )}
      </Form.Field>
      <Form.Field error={passwordError}>
        <label>Password</label>
        <SPInput
          data-testid="signup-form-password-input"
          title="password"
          disabled={props.form.isSubmitting}
          placeholder="Password"
          type="password"
          value={props.form.values.password}
          onChange={props.onChangePassword}
        />
        {passwordError && (
          <SPText
            data-testid="signup-form-password-error"
            style={styles['mt-0.5rem']}
          >
            {props.form.errors.password}
          </SPText>
        )}
      </Form.Field>
      <Form.Field error={confirmedPasswordError}>
        <label>Confirm password</label>
        <SPInput
          data-testid="signup-form-confirmed-password-input"
          title="confirm password"
          disabled={props.form.isSubmitting}
          placeholder="Confirm password"
          type="password"
          value={props.form.values.confirmedPassword}
          onChange={props.onChangeConfirmedPassword}
        />
        {confirmedPasswordError && (
          <SPText
            data-testid="signup-form-confirmed-password-error"
            style={styles['mt-0.5rem']}
          >
            {props.form.errors.confirmedPassword}
          </SPText>
        )}
      </Form.Field>
      <SPButton
        type="submit"
        disabled={props.form.isSubmitting}
        className="align-self-end"
      >
        Submit
      </SPButton>
    </Form>
  )
}

function Signup() {
  const signupMutation = useSignupMutation()

  const form = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmedPassword: '',
    },
    validationSchema: UserFormSchema,
    onSubmit: (data: any) => signupMutation.mutate(data),
  })

  useEffect(() => {
    const isSubmitting = signupMutation.status === 'loading'
    form.setSubmitting(isSubmitting)
  }, [form, signupMutation.status])

  const handleChangeFirstName = (e: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('firstName', e.target.value)
  }
  const handleChangeLastName = (e: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('lastName', e.target.value)
  }
  const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('email', e.target.value)
  }
  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('password', e.target.value)
  }
  const handleChangeConfirmedPassword = (e: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('confirmedPassword', e.target.value)
  }

  const renderSignupComponent = () => {
    const commonProps = {
      form,
      onChangeFirstName: handleChangeFirstName,
      onChangeLastName: handleChangeLastName,
      onChangeEmail: handleChangeEmail,
      onChangePassword: handleChangePassword,
      onChangeConfirmedPassword: handleChangeConfirmedPassword,
      onSignup: form.submitForm,
    }
    switch (signupMutation.status) {
      case 'idle': {
        return (
          <div data-testid="signup-form">
            <SignupComponent {...commonProps} />
          </div>
        )
      }
      case 'loading': {
        return (
          <>
            <Loader active />
            <SignupComponent {...commonProps} />
          </>
        )
      }
      case 'success': {
        return (
          <Message positive>
            <Message.Header>Signup successful</Message.Header>
            <p>An email has been sent to you.</p>
          </Message>
        )
      }
      case 'error': {
        return (
          <>
            <Message negative>
              <Message.Header>Signup failed</Message.Header>
              <p>Please try again.</p>
            </Message>
            <SignupComponent {...commonProps} />
          </>
        )
      }
    }
  }

  return (
    <Container>
      <div className="justify-space-between bordered p-1r mb-1r">
        <SPHeader as="h1">Spaced Reps</SPHeader>
      </div>
      {renderSignupComponent()}
    </Container>
  )
}

export default Signup
