import React, { Suspense } from 'react'
import { connect, ConnectedProps, Provider } from 'react-redux'
import { Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { has, map, values } from 'ramda'
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
const RemindWalletGuid = React.lazy(() => import('./RemindWalletGuid'))
const ResetWallet2fa = React.lazy(() => import('./ResetWallet2fa'))
const ResetWallet2faToken = React.lazy(() => import('./ResetWallet2faToken'))
const UploadDocuments = React.lazy(() => import('./UploadDocuments'))
const UploadDocumentsSuccess = React.lazy(() => import('./UploadDocuments/Success'))
const VerifyEmail = React.lazy(() => import('./VerifyEmail'))
const VerifyEmailToken = React.lazy(() => import('./VerifyEmailToken'))

// WALLET
const Addresses = React.lazy(() => import('./Settings/Addresses'))
const Airdrops = React.lazy(() => import('./Airdrops'))
const Borrow = React.lazy(() => import('./Borrow'))
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
                      <PublicLayout path='/reminder' component={RemindWalletGuid} />
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
                      <WalletLayout path='/borrow' component={Borrow} />
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
                          const coin = coinModel.coinCode
                          const isFiat = coin === 'USD' || coin === 'EUR' || coin === 'GBP'
                          return (
                            coinModel.txListAppRoute &&
                            coinModel.invited && (
                              <WalletLayout
                                path={coinModel.txListAppRoute}
                                component={Transactions}
                                coin={coin}
                                isCoinErc20={has('contractAddress', coinModel)}
                                isFiat={isFiat}
                                key={coin}
                              />
                            )
                          )
                        }, this.props.supportedCoins)
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
  isAuthenticated: selectors.auth.isAuthenticated(state),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail('No supported coins.'),
  userData: selectors.modules.profile.getUserData(state).getOrElse({} as UserDataType)
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
