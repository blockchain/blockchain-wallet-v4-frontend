import React, { Suspense, useEffect } from 'react'
import { connect, ConnectedProps, Provider } from 'react-redux'
import { Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { map, values } from 'ramda'
import { Store } from 'redux'
import { PersistGate } from 'redux-persist/integration/react'
import { createClient, Provider as UrqlProvider } from 'urql'

import { WalletOptionsType } from '@core/types'
import SiftScience from 'components/SiftScience'
import SupportChat from 'components/SupportChat'
import { selectors } from 'data'
import { UserDataType } from 'data/types'
import AuthLayout from 'layouts/Auth'
import ExploreLayout from 'layouts/Explore'
import WalletLayout from 'layouts/Wallet'
import { UTM } from 'middleware/analyticsMiddleware/constants'
import { utmParser } from 'middleware/analyticsMiddleware/utils'
import { MediaContextProvider } from 'providers/MatchMediaProvider'
import ThemeProvider from 'providers/ThemeProvider'
import TranslationsProvider from 'providers/TranslationsProvider'
import { getTracking } from 'services/tracking'

import AuthLoading from './loading.auth'
import WalletLoading from './loading.wallet'

// PUBLIC
const AuthorizeLogin = React.lazy(() => import('./AuthorizeLogin'))
const Help = React.lazy(() => import('./Help'))
const HelpExchange = React.lazy(() => import('./HelpExchange'))
const Login = React.lazy(() => import('./Login'))
const Logout = React.lazy(() => import('./Logout'))
const MobileLogin = React.lazy(() => import('./MobileLogin'))
const RecoverWallet = React.lazy(() => import('./RecoverWallet'))
const Signup = React.lazy(() => import('./Signup'))
const ResetWallet2fa = React.lazy(() => import('./ResetWallet2fa'))
const ResetWallet2faToken = React.lazy(() => import('./ResetWallet2faToken'))
const UploadDocuments = React.lazy(() => import('./UploadDocuments'))
const UploadDocumentsSuccess = React.lazy(() => import('./UploadDocuments/Success'))
const VerifyEmailToken = React.lazy(() => import('./VerifyEmailToken'))
const VerifyEmail = React.lazy(() => import('./VerifyEmail'))

// EXPLORE (mixed)
const NftsExplorer = React.lazy(() => import('./Nfts/Explore'))
const NftsCollection = React.lazy(() => import('./Nfts/Collection'))
const NftsAsset = React.lazy(() => import('./Nfts/Asset'))

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
const NftsActivty = React.lazy(() => import('./Nfts/Activity'))
const NftsAssets = React.lazy(() => import('./Nfts/Assets'))
const SecurityCenter = React.lazy(() => import('./SecurityCenter'))
const TheExchange = React.lazy(() => import('./TheExchange'))
const Transactions = React.lazy(() => import('./Transactions'))
const WalletConnect = React.lazy(() => import('./WalletConnect'))

const client = createClient({
  url: 'http://localhost:4000/graphql'
})

const App = ({
  apiUrl,
  coinsWithBalance,
  history,
  isAuthenticated,
  persistor,
  store,
  userData,
  walletConnectEnabled
}: Props) => {
  const Loading = isAuthenticated ? WalletLoading : AuthLoading

  useEffect(() => {
    const utm = utmParser(window.location.hash)

    sessionStorage.setItem(UTM, JSON.stringify(utm))

    getTracking({ url: apiUrl })
  }, [apiUrl])

  return (
    <Provider store={store}>
      <UrqlProvider value={client}>
        <ThemeProvider>
          <TranslationsProvider>
            <PersistGate loading={<Loading />} persistor={persistor}>
              <MediaContextProvider>
                <ConnectedRouter history={history}>
                  <Suspense fallback={<Loading />}>
                    <Switch>
                      <AuthLayout path='/authorize-approve' component={AuthorizeLogin} />
                      <AuthLayout path='/help' component={Help} />
                      <AuthLayout path='/help-exchange' component={HelpExchange} />
                      <AuthLayout path='/login' component={Login} />
                      <AuthLayout path='/logout' component={Logout} />
                      <AuthLayout path='/mobile-login' component={MobileLogin} />
                      <AuthLayout path='/recover' component={RecoverWallet} />
                      <AuthLayout path='/reset-2fa' component={ResetWallet2fa} />
                      <AuthLayout path='/reset-two-factor' component={ResetWallet2faToken} />
                      <AuthLayout path='/signup' component={Signup} />
                      <AuthLayout path='/verify-email' component={VerifyEmailToken} />
                      <AuthLayout
                        path='/upload-document/success'
                        component={UploadDocumentsSuccess}
                        exact
                      />
                      <AuthLayout path='/upload-document/:token' component={UploadDocuments} />
                      <AuthLayout path='/wallet' component={Login} />
                      <AuthLayout path='/verify-email-step' component={VerifyEmail} />
                      <WalletLayout path='/nfts/activity' exact component={NftsActivty} />
                      <WalletLayout path='/nfts/assets' exact component={NftsAssets} />
                      <ExploreLayout path='/nfts/:contract/:id' exact component={NftsAsset} />
                      <ExploreLayout path='/nfts/:slug' exact component={NftsCollection} />
                      <ExploreLayout path='/nfts' exact component={NftsExplorer} />
                      <WalletLayout path='/airdrops' component={Airdrops} />
                      <WalletLayout path='/exchange' component={TheExchange} />
                      <WalletLayout path='/home' component={Home} />
                      <WalletLayout path='/rewards' component={Interest} exact />
                      <WalletLayout path='/rewards/history' component={InterestHistory} />
                      <WalletLayout path='/lockbox' component={Lockbox} />
                      <WalletLayout path='/security-center' component={SecurityCenter} />
                      <WalletLayout path='/settings/addresses' component={Addresses} />
                      <WalletLayout path='/settings/general' component={General} />
                      <WalletLayout path='/settings/preferences' component={Preferences} />
                      {walletConnectEnabled && (
                        <WalletLayout path='/dapps' component={WalletConnect} />
                      )}
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
                        }, coinsWithBalance)
                      )}
                      {isAuthenticated ? (
                        coinsWithBalance.length ? (
                          <Redirect to='/home' />
                        ) : null
                      ) : (
                        <Redirect to='/login' />
                      )}
                    </Switch>
                  </Suspense>
                </ConnectedRouter>
                {isAuthenticated && <SupportChat />}
                <SiftScience userId={userData.id} />
              </MediaContextProvider>
            </PersistGate>
          </TranslationsProvider>
        </ThemeProvider>
      </UrqlProvider>
    </Provider>
  )
}

const mapStateToProps = (state) => ({
  apiUrl: selectors.core.walletOptions.getDomains(state).getOrElse({
    api: 'https://api.blockchain.info'
  } as WalletOptionsType['domains']).api,
  coinsWithBalance: selectors.components.utils.getCoinsWithBalanceOrMethod(state).getOrElse([]),
  isAuthenticated: selectors.auth.isAuthenticated(state) as boolean,
  userData: selectors.modules.profile.getUserData(state).getOrElse({} as UserDataType),
  walletConnectEnabled: selectors.core.walletOptions
    .getWalletConnectEnabled(state)
    .getOrElse(false) as boolean
})

const connector = connect(mapStateToProps)

type Props = {
  history: History
  persistor
  store: Store
} & ConnectedProps<typeof connector>

export default connector(App)
