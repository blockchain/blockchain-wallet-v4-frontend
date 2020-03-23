import { Switch } from 'react-router-dom'
import AuthorizeLogin from './AuthorizeLogin'
import Help from './Help'
import Login from './Login'
import Logout from './Logout'
import MobileLogin from './MobileLogin'
import PublicLayout from 'layouts/Public'
import React from 'react'
import Recover from './Recover'
import Register from './Register'
import Reminder from './Reminder'
import Reset2FA from './Reset2FA'
import Reset2FAToken from './Reset2FAToken'
import UploadDocuments from './UploadDocuments'
import UploadDocumentsSuccess from './UploadDocuments/Success'
import VerifyEmailToken from './VerifyEmailToken'

type Props = {}

const PublicSwitch: React.FC<Props> = () => {
  return (
    <Switch>
      <PublicLayout path='/login' component={Login} />
      <PublicLayout path='/logout' component={Logout} />
      <PublicLayout path='/help' component={Help} />
      <PublicLayout path='/recover' component={Recover} />
      <PublicLayout path='/reminder' component={Reminder} />
      <PublicLayout path='/reset-2fa' component={Reset2FA} />
      <PublicLayout path='/mobile-login' component={MobileLogin} />
      <PublicLayout path='/reset-two-factor' component={Reset2FAToken} />
      <PublicLayout path='/verify-email' component={VerifyEmailToken} />
      <PublicLayout path='/signup' component={Register} />
      <PublicLayout path='/authorize-approve' component={AuthorizeLogin} />
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
  )
}

export default PublicSwitch
