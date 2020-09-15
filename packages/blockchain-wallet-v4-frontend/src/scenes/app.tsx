import { connect, ConnectedProps, Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { has, map, values } from 'ramda'
import { PersistGate } from 'redux-persist/integration/react'
import { Redirect, Switch } from 'react-router-dom'
import React, { Suspense } from 'react'

import { MediaContextProvider } from 'providers/MatchMediaProvider'
import { selectors } from 'data'
import AnalyticsTracker from 'providers/AnalyticsTracker'
import ThemeProvider from 'providers/ThemeProvider'
import TranslationsProvider from 'providers/TranslationsProvider'

import { UserDataType } from 'data/types'
import PublicLayout from 'layouts/Public'
import PublicLoading from './loading.public'
import SiftScience from 'components/SiftScience'
import WalletLayout from 'layouts/Wallet'
import WalletLoading from './loading.wallet'

// PUBLIC
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

// WALLET
const Addresses = React.lazy(() => import('./Settings/Addresses'))
const Airdrops = React.lazy(() => import('./Airdrops'))
const Borrow = React.lazy(() => import('./Borrow'))
const Exchange = React.lazy(() => import('./Exchange'))
const ExchangeHistory = React.lazy(() => import('./ExchangeHistory'))
const ExchangeProfile = React.lazy(() => import('./ExchangeProfile'))
const General = React.lazy(() => import('./Settings/General'))
const Home = React.lazy(() => import('./Home'))
const Interest = React.lazy(() => import('./Interest'))
const Lockbox = React.lazy(() => import('./Lockbox'))
const Preferences = React.lazy(() => import('./Settings/Preferences'))
const Profile = React.lazy(() => import('./Settings/Profile'))
const SecurityCenter = React.lazy(() => import('./SecurityCenter'))
const TheExchange = React.lazy(() => import('./TheExchange'))
const Transactions = React.lazy(() => import('./Transactions'))

class App extends React.PureComponent<Props> {
  render () {
    const { store, history, persistor, isAuthenticated } = this.props
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
                      <PublicLayout
                        path='/authorize-approve'
                        component={AuthorizeLogin}
                      />
                      <PublicLayout path='/help' component={Help} />
                      <PublicLayout path='/login' component={Login} />
                      <PublicLayout path='/logout' component={Logout} />
                      <PublicLayout
                        path='/mobile-login'
                        component={MobileLogin}
                      />
                      <PublicLayout path='/recover' component={Recover} />
                      <PublicLayout path='/reminder' component={Reminder} />
                      <PublicLayout path='/reset-2fa' component={Reset2FA} />
                      <PublicLayout
                        path='/reset-two-factor'
                        component={Reset2FAToken}
                      />
                      <PublicLayout path='/signup' component={Register} />
                      <PublicLayout
                        path='/verify-email'
                        component={VerifyEmailToken}
                      />
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
                      <WalletLayout path='/airdrops' component={Airdrops} />
                      <WalletLayout path='/borrow' component={Borrow} />
                      <WalletLayout path='/exchange' component={TheExchange} />
                      <WalletLayout path='/home' component={Home} />
                      <WalletLayout path='/interest' component={Interest} />
                      <WalletLayout path='/lockbox' component={Lockbox} />
                      <WalletLayout
                        path='/security-center'
                        component={SecurityCenter}
                      />
                      <WalletLayout
                        path='/settings/addresses'
                        component={Addresses}
                      />
                      <WalletLayout
                        path='/settings/general'
                        component={General}
                      />
                      <WalletLayout
                        path='/settings/preferences'
                        component={Preferences}
                      />
                      <WalletLayout
                        path='/settings/profile'
                        component={Profile}
                      />
                      <WalletLayout path='/swap' component={Exchange} exact />
                      <WalletLayout
                        path='/swap/history'
                        component={ExchangeHistory}
                      />
                      <WalletLayout
                        path='/swap/profile'
                        component={ExchangeProfile}
                      />
                      {values(
                        map(
                          coin =>
                            coin.txListAppRoute &&
                            coin.invited && (
                              <WalletLayout
                                path={coin.txListAppRoute}
                                component={Transactions}
                                coin={coin.coinCode}
                                isCoinErc20={has('contractAddress', coin)}
                                key={coin.coinCode}
                              />
                            ),
                          this.props.supportedCoins
                        )
                      )}
                      {isAuthenticated ? (
                        <Redirect to='/home' />
                      ) : (
                        <Redirect to='/login' />
                      )}
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

const mapStateToProps = state => ({
  isAuthenticated: selectors.auth.isAuthenticated(state),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail('No supported coins.'),
  userData: selectors.modules.profile
    .getUserData(state)
    .getOrElse({} as UserDataType)
})

const connector = connect(mapStateToProps)

type Props = {
  history: any
  isAuthenticated: boolean
  persistor: any
  store: any
  supportedCoins: any
} & ConnectedProps<typeof connector>

export default connector(App)
