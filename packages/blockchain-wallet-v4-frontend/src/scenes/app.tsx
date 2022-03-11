import React, { Suspense, useEffect } from 'react'
import { connect, ConnectedProps, Provider } from 'react-redux'
import { Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { map, values } from 'ramda'
import { Store } from 'redux'
import { PersistGate } from 'redux-persist/integration/react'

import { WalletOptionsType } from '@core/types'
import SiftScience from 'components/SiftScience'
import SupportChat from 'components/SupportChat'
import { selectors } from 'data'
import { UserDataType } from 'data/types'
import PublicLayout from 'layouts/Public'
import WalletLayout from 'layouts/Wallet'
import { UTM } from 'middleware/analyticsMiddleware/constants'
import { utmParser } from 'middleware/analyticsMiddleware/utils'
import { MediaContextProvider } from 'providers/MatchMediaProvider'
import ThemeProvider from 'providers/ThemeProvider'
import TranslationsProvider from 'providers/TranslationsProvider'
import { getTracking } from 'services/tracking'

import PublicLoading from './loading.public'
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
const Nfts = React.lazy(() => import('./Nfts'))
const SecurityCenter = React.lazy(() => import('./SecurityCenter'))
const TaxCenter = React.lazy(() => import('./TaxCenter'))
const TheExchange = React.lazy(() => import('./TheExchange'))
const Transactions = React.lazy(() => import('./Transactions'))
const WalletConnect = React.lazy(() => import('./WalletConnect'))
const DebitCard = React.lazy(() => import('./DebitCard'))

const App = ({
  apiUrl,
  coinsWithBalance,
  history,
  isAuthenticated,
  persistor,
  store,
  taxCenterEnabled,
  userData,
  walletConnectEnabled,
  walletDebitCardEnabled
}: Props) => {
  const Loading = isAuthenticated ? WalletLoading : PublicLoading

  useEffect(() => {
    const utm = utmParser(window.location.hash)

    sessionStorage.setItem(UTM, JSON.stringify(utm))

    getTracking({ url: apiUrl })
  }, [apiUrl])

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
                    <PublicLayout path='/help-exchange' component={HelpExchange} />
                    <PublicLayout path='/login' component={Login} />
                    <PublicLayout path='/logout' component={Logout} />
                    <PublicLayout path='/mobile-login' component={MobileLogin} />
                    <PublicLayout path='/recover' component={RecoverWallet} />
                    <PublicLayout path='/reset-2fa' component={ResetWallet2fa} />
                    <PublicLayout path='/reset-two-factor' component={ResetWallet2faToken} />
                    <PublicLayout path='/signup' component={Signup} />
                    <PublicLayout path='/verify-email' component={VerifyEmailToken} />
                    <PublicLayout
                      path='/upload-document/success'
                      component={UploadDocumentsSuccess}
                      exact
                    />
                    <PublicLayout path='/upload-document/:token' component={UploadDocuments} />
                    <PublicLayout path='/wallet' component={Login} />
                    <PublicLayout path='/verify-email-step' component={VerifyEmail} />
                    {walletDebitCardEnabled && (
                      <WalletLayout path='/debitCard' component={DebitCard} />
                    )}
                    <WalletLayout path='/airdrops' component={Airdrops} />
                    <WalletLayout path='/exchange' component={TheExchange} />
                    <WalletLayout path='/home' component={Home} />
                    <WalletLayout path='/rewards' component={Interest} exact />
                    <WalletLayout path='/rewards/history' component={InterestHistory} />
                    <WalletLayout path='/nfts' component={Nfts} />
                    <WalletLayout path='/lockbox' component={Lockbox} />
                    <WalletLayout path='/security-center' component={SecurityCenter} />
                    <WalletLayout path='/settings/addresses' component={Addresses} />
                    <WalletLayout path='/settings/general' component={General} />
                    <WalletLayout path='/settings/preferences' component={Preferences} />
                    {walletConnectEnabled && (
                      <WalletLayout path='/dapps' component={WalletConnect} />
                    )}
                    <WalletLayout path='/prices' component={Prices} />
                    {taxCenterEnabled && <WalletLayout path='/tax-center' component={TaxCenter} />}
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
    </Provider>
  )
}

const mapStateToProps = (state) => ({
  apiUrl: selectors.core.walletOptions.getDomains(state).getOrElse({
    api: 'https://api.blockchain.info'
  } as WalletOptionsType['domains']).api,
  coinsWithBalance: selectors.components.utils.getCoinsWithBalanceOrMethod(state).getOrElse([]),
  isAuthenticated: selectors.auth.isAuthenticated(state) as boolean,
  taxCenterEnabled: selectors.core.walletOptions
    .getTaxCenterEnabled(state)
    .getOrElse(false) as boolean,
  userData: selectors.modules.profile.getUserData(state).getOrElse({} as UserDataType),
  walletConnectEnabled: selectors.core.walletOptions
    .getWalletConnectEnabled(state)
    .getOrElse(false) as boolean,
  walletDebitCardEnabled: selectors.components.debitCard.isDebitCardModuleEnabledForAccount(state)
})

const connector = connect(mapStateToProps)

type Props = {
  history: History
  persistor
  store: Store
} & ConnectedProps<typeof connector>

export default connector(App)
