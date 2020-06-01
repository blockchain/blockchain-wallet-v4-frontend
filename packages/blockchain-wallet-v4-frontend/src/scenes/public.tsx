import { Switch } from 'react-router-dom'
import React, { Suspense } from 'react'

import Loading from './loading.public'
import PublicLayout from 'layouts/Public'

const AuthorizeLogin = React.lazy(() => import('./AuthorizeLogin'))
const Help = React.lazy(() => import('./Help'))
const Login = React.lazy(() => import('./Login'))
const Logout = React.lazy(() => import('./Logout'))
const MobileLogin = React.lazy(() => import('./MobileLogin'))
const Recover = React.lazy(() => import('./Recover'))
const Register = React.lazy(() => import('./Register'))
const Reminder = React.lazy(() => import('./Reminder'))
const Reset2FA = React.lazy(() => import('./Reset2FA'))
const Reset2FAToken = React.lazy(() => import('./Reset2FAToken'))
const UploadDocuments = React.lazy(() => import('./UploadDocuments'))
const UploadDocumentsSuccess = React.lazy(() =>
  import('./UploadDocuments/Success')
)
const VerifyEmailToken = React.lazy(() => import('./VerifyEmailToken'))

type Props = {}

const PublicSwitch: React.FC<Props> = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Switch>
        <PublicLayout path='/authorize-approve' component={AuthorizeLogin} />
        <PublicLayout path='/help' component={Help} />
        <PublicLayout path='/login' component={Login} />
        <PublicLayout path='/logout' component={Logout} />
        <PublicLayout path='/mobile-login' component={MobileLogin} />
        <PublicLayout path='/recover' component={Recover} />
        <PublicLayout path='/reminder' component={Reminder} />
        <PublicLayout path='/reset-2fa' component={Reset2FA} />
        <PublicLayout path='/reset-two-factor' component={Reset2FAToken} />
        <PublicLayout path='/signup' component={Register} />
        <PublicLayout path='/verify-email' component={VerifyEmailToken} />
        <PublicLayout
          path='/upload-document/success'
          component={UploadDocumentsSuccess}
          exact
        />
        <PublicLayout
          path='/upload-document/:token'
          component={UploadDocuments}
        />
        <PublicLayout path='/wallet' component={Login} />
      </Switch>
    </Suspense>
  )
}

export default PublicSwitch
