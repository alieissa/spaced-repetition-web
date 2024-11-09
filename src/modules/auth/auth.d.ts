   type UserLogin = {
    email: string,
    password: string,
  }
   type UserToken = {
    token: string
  }
   type RememberMeUserForm = UserLogin & {
    rememberMe: boolean
  }
   type ForgotPasswordForm = {
    email: string
  }
   type ResetPasswordForm = {
    password: string
    confirmedPassword: string
   }
