import React, { Suspense } from 'react'
import { connect, ConnectedProps, Provider } from 'react-redux'
import { Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { map, values } from 'ramda'
import { PersistGate } from 'redux-persist/integration/react'

import SiftScience from 'components/SiftScience'
import { selectors } from 'data'
import { UserDataType } from 'data/types'
import PublicLayout from 'layouts/Public'
import WalletLayout from 'layouts/Wallet'
import AnalyticsTracker from 'providers/AnalyticsTracker'
import { MediaContextProvider } from 'providers/MatchMediaProvider'
import ThemeProvider from 'providers/ThemeProvider'
import TranslationsProvider from 'providers/TranslationsProvider'

import PublicLoading from './loading.public'
import WalletLoading from './loading.wallet'

// PUBLIC
const AuthorizeLogin = React.lazy(() => import('./AuthorizeLogin'))
const Help = React.lazy(() => import('./Help'))
const Login = React.lazy(() => import('./Login'))
const Logout = React.lazy(() => import('./Logout'))
const MobileLogin = React.lazy(() => import('./MobileLogin'))
const RecoverWallet = React.lazy(() => import('./RecoverWallet'))
const Register = React.lazy(() => import('./Register'))
const ResetWallet2fa = React.lazy(() => import('./ResetWallet2fa'))
const ResetWallet2faToken = React.lazy(() => import('./ResetWallet2faToken'))
const UploadDocuments = React.lazy(() => import('./UploadDocuments'))
const UploadDocumentsSuccess = React.lazy(() => import('./UploadDocuments/Success'))
const VerifyEmailToken = React.lazy(() => import('./VerifyEmailToken'))
const VerifyEmail = React.lazy(() => import('./VerifyEmail'))

// WALLET
const Addresses = React.lazy(() => import('./Settings/Addresses'))
const Airdrops = React.lazy(() => import('./Airdrops'))
const General = React.lazy(() => import('./Settings/General'))
const Home = React.lazy(() => import('./Home'))
const Interest = React.lazy(() => import('./Interest'))
const InterestHistory = React.lazy(() => import('./InterestHistory'))
const Lockbox = React.lazy(() => import('./Lockbox'))
const Preferences = React.lazy(() => import('./Settings/Preferences'))
const Prices = React.lazy(() => import('./Prices'))
const SecurityCenter = React.lazy(() => import('./SecurityCenter'))
const TheExchange = React.lazy(() => import('./TheExchange'))
const Transactions = React.lazy(() => import('./Transactions'))

class App extends React.PureComponent<Props> {
  render() {
    const { history, isAuthenticated, persistor, store } = this.props
    const Loading = isAuthenticated ? WalletLoading : PublicLoading
    return (
      <Provider store={store}>
        <ThemeProvider>
          <TranslationsProvider>
            <PersistGate loading={<Loading />} persistor={persistor}>
              <MediaContextProvider>
                <ConnectedRouter history={history}>
                  <Suspense fallback={<Loading />}>
                    <Switch>
                      <PublicLayout path='/authorize-approve' component={AuthorizeLogin} />
                      <PublicLayout path='/help' component={Help} />
                      <PublicLayout path='/login' component={Login} />
                      <PublicLayout path='/logout' component={Logout} />
                      <PublicLayout path='/mobile-login' component={MobileLogin} />
                      <PublicLayout path='/recover' component={RecoverWallet} />
                      <PublicLayout path='/reset-2fa' component={ResetWallet2fa} />
                      <PublicLayout path='/reset-two-factor' component={ResetWallet2faToken} />
                      <PublicLayout path='/signup' component={Register} />
                      <PublicLayout path='/verify-email' component={VerifyEmailToken} />
                      <PublicLayout
                        path='/upload-document/success'
                        component={UploadDocumentsSuccess}
                        exact
                      />
                      <PublicLayout path='/upload-document/:token' component={UploadDocuments} />
                      <PublicLayout path='/wallet' component={Login} />
                      <PublicLayout path='/verify-email-step' component={VerifyEmail} />
                      <WalletLayout path='/airdrops' component={Airdrops} />
                      <WalletLayout path='/exchange' component={TheExchange} />
                      <WalletLayout path='/home' component={Home} />
                      <WalletLayout path='/interest' component={Interest} exact />
                      <WalletLayout path='/interest/history' component={InterestHistory} />
                      <WalletLayout path='/lockbox' component={Lockbox} />
                      <WalletLayout path='/security-center' component={SecurityCenter} />
                      <WalletLayout path='/settings/addresses' component={Addresses} />
                      <WalletLayout path='/settings/general' component={General} />
                      <WalletLayout path='/settings/preferences' component={Preferences} />
                      <WalletLayout path='/prices' component={Prices} />
                      {values(
                        map((coinModel) => {
                          const { coinfig } = coinModel
                          return (
                            <WalletLayout
                              path={`/${coinfig.symbol}/transactions`}
                              component={Transactions}
                              coinfig={coinfig}
                              coin={coinfig.symbol}
                              key={coinfig.symbol}
                            />
                          )
                        }, this.props.coinsWithMethodAndOrder)
                      )}
                      {isAuthenticated ? <Redirect to='/home' /> : <Redirect to='/login' />}
                    </Switch>
                  </Suspense>
                </ConnectedRouter>
                <SiftScience userId={this.props.userData.id} />
                <AnalyticsTracker />
              </MediaContextProvider>
            </PersistGate>
          </TranslationsProvider>
        </ThemeProvider>
      </Provider>
    )
  }
}

const mapStateToProps = (state) => ({
  coinsWithMethodAndOrder: selectors.components.utils
    .getCoinsWithMethodAndOrder(state)
    .getOrElse([]),
  isAuthenticated: selectors.auth.isAuthenticated(state) as boolean,
  userData: selectors.modules.profile.getUserData(state).getOrElse({} as UserDataType)
})

const connector = connect(mapStateToProps)

type Props = {
  coinsWithMethodAndOrder: any
  history: any
  isAuthenticated: boolean
  persistor: any
  store: any
} & ConnectedProps<typeof connector>

export default connector(App)
