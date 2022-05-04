import React, { Suspense, useEffect } from 'react'
import { connect, ConnectedProps, Provider } from 'react-redux'
import { Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { Store } from 'redux'
import { PersistGate } from 'redux-persist/integration/react'
import { createClient, Provider as UrqlProvider } from 'urql'

import { WalletOptionsType } from '@core/types'
import SiftScience from 'components/SiftScience'
import SupportChat from 'components/SupportChat'
import { selectors } from 'data'
import { UserDataType } from 'data/types'
import AuthLayout from 'layouts/Auth'
import AuthLoading from 'layouts/Auth/template.loading'
import NftsLayout from 'layouts/Nfts'
import WalletLayout from 'layouts/Wallet'
import WalletLoading from 'layouts/Wallet/template.loading'
import { UTM } from 'middleware/analyticsMiddleware/constants'
import { utmParser } from 'middleware/analyticsMiddleware/utils'
import { MediaContextProvider } from 'providers/MatchMediaProvider'
import ThemeProvider from 'providers/ThemeProvider'
import TranslationsProvider from 'providers/TranslationsProvider'
import { getTracking } from 'services/tracking'

// PUBLIC
const AuthorizeLogin = React.lazy(() => import('./AuthorizeLogin'))
const Help = React.lazy(() => import('./Help'))
const HelpExchange = React.lazy(() => import('./HelpExchange'))
const Login = React.lazy(() => import('./Login'))
const Logout = React.lazy(() => import('./Logout'))
const MobileLogin = React.lazy(() => import('./MobileLogin'))
const ProductPicker = React.lazy(() => import('./ProductPicker'))
const RecoverWallet = React.lazy(() => import('./RecoverWallet'))
const Signup = React.lazy(() => import('./Signup'))
const ResetWallet2fa = React.lazy(() => import('./ResetWallet2fa'))
const ResetWallet2faToken = React.lazy(() => import('./ResetWallet2faToken'))
const UploadDocuments = React.lazy(() => import('./UploadDocuments'))
const UploadDocumentsSuccess = React.lazy(() => import('./UploadDocuments/Success'))
const VerifyEmailToken = React.lazy(() => import('./VerifyEmailToken'))
const VerifyEmail = React.lazy(() => import('./VerifyEmail'))

// EXPLORE (mixed)
const NftsHome = React.lazy(() => import('./Nfts/Home'))
const NftsFirehose = React.lazy(() => import('./Nfts/Firehose'))
const NftsCollection = React.lazy(() => import('./Nfts/Collection/Collection'))
const NftsAsset = React.lazy(() => import('./Nfts/Asset'))

// WALLET
const Addresses = React.lazy(() => import('./Settings/Addresses'))
const Airdrops = React.lazy(() => import('./Airdrops'))
const CoinPage = React.lazy(() => import('./CoinPage/components/CoinPage'))
const General = React.lazy(() => import('./Settings/General'))
const Home = React.lazy(() => import('./Home'))
const Interest = React.lazy(() => import('./Interest'))
const InterestHistory = React.lazy(() => import('./InterestHistory'))
const Preferences = React.lazy(() => import('./Settings/Preferences'))
const Prices = React.lazy(() => import('./Prices'))
const NftsAddress = React.lazy(() => import('./Nfts/Address/Address'))
const SecurityCenter = React.lazy(() => import('./SecurityCenter'))
const TaxCenter = React.lazy(() => import('./TaxCenter'))
const TheExchange = React.lazy(() => import('./TheExchange'))
const Transactions = React.lazy(() => import('./Transactions'))
const WalletConnect = React.lazy(() => import('./WalletConnect'))
const DebitCard = React.lazy(() => import('./DebitCard'))

const BLOCKCHAIN_TITLE = 'Blockchain.com'

const App = ({
  apiUrl,
  coinViewV2,
  history,
  isAuthenticated,
  nftExplorer,
  persistor,
  store,
  taxCenterEnabled,
  userData,
  walletConnectEnabled,
  walletDebitCardEnabled
}: Props) => {
  const Loading = isAuthenticated ? WalletLoading : AuthLoading

  // parse and log UTMs
  useEffect(() => {
    const utm = utmParser()
    sessionStorage.setItem(UTM, JSON.stringify(utm))
    getTracking({ url: apiUrl })
  }, [apiUrl])

  const client = createClient({
    url: `${apiUrl}/nft-market-api/graphql/`
  })

  return (
    <Provider store={store}>
      <ThemeProvider>
        <TranslationsProvider>
          <PersistGate loading={<Loading />} persistor={persistor}>
            <MediaContextProvider>
              <UrqlProvider value={client}>
                <ConnectedRouter history={history}>
                  <Suspense fallback={<Loading />}>
                    <Switch>
                      <AuthLayout path='/authorize-approve' component={AuthorizeLogin} />
                      <AuthLayout
                        path='/help'
                        component={Help}
                        pageTitle={`${BLOCKCHAIN_TITLE} | Help`}
                      />
                      <AuthLayout
                        path='/help-exchange'
                        component={HelpExchange}
                        pageTitle={`${BLOCKCHAIN_TITLE} | Help`}
                      />
                      <AuthLayout
                        path='/login'
                        component={Login}
                        pageTitle={`${BLOCKCHAIN_TITLE} | Login`}
                      />
                      <AuthLayout path='/logout' component={Logout} />
                      <AuthLayout
                        path='/select-product'
                        component={ProductPicker}
                        pageTitle={`${BLOCKCHAIN_TITLE} | Product Select`}
                      />
                      <AuthLayout
                        path='/mobile-login'
                        component={MobileLogin}
                        pageTitle={`${BLOCKCHAIN_TITLE} | Login`}
                      />
                      <AuthLayout
                        path='/recover'
                        component={RecoverWallet}
                        pageTitle={`${BLOCKCHAIN_TITLE} | Recover`}
                      />
                      <AuthLayout
                        path='/reset-2fa'
                        component={ResetWallet2fa}
                        pageTitle={`${BLOCKCHAIN_TITLE} | Reset 2FA`}
                      />
                      <AuthLayout
                        path='/reset-two-factor'
                        component={ResetWallet2faToken}
                        pageTitle={`${BLOCKCHAIN_TITLE} | Reset 2FA`}
                      />
                      <AuthLayout
                        path='/signup'
                        component={Signup}
                        pageTitle={`${BLOCKCHAIN_TITLE} | Sign up`}
                      />
                      <AuthLayout
                        path='/verify-email'
                        component={VerifyEmailToken}
                        pageTitle={`${BLOCKCHAIN_TITLE} | Verify Email`}
                      />
                      <AuthLayout
                        path='/upload-document/success'
                        component={UploadDocumentsSuccess}
                        exact
                      />
                      <AuthLayout path='/upload-document/:token' component={UploadDocuments} />
                      <AuthLayout
                        path='/wallet'
                        component={Login}
                        pageTitle={`${BLOCKCHAIN_TITLE} | Login`}
                      />
                      <AuthLayout
                        path='/verify-email-step'
                        component={VerifyEmail}
                        pageTitle={`${BLOCKCHAIN_TITLE} | Verify Email`}
                      />
                      {nftExplorer && (
                        <NftsLayout path='/nfts/address/:address' exact component={NftsAddress} />
                      )}
                      {nftExplorer && (
                        <NftsLayout path='/nfts/asset/:contract/:id' exact component={NftsAsset} />
                      )}
                      {nftExplorer && (
                        <NftsLayout
                          path='/nfts/collection/:slug'
                          exact
                          component={NftsCollection}
                        />
                      )}
                      {nftExplorer && (
                        <NftsLayout
                          path='/nfts'
                          exact
                          component={NftsHome}
                          pageTitle={`${BLOCKCHAIN_TITLE} | NFT Explorer`}
                        />
                      )}
                      {nftExplorer && (
                        <NftsLayout
                          path='/nfts/explore'
                          exact
                          component={NftsFirehose}
                          pageTitle={`${BLOCKCHAIN_TITLE} | NFT Explorer`}
                        />
                      )}

                      {walletDebitCardEnabled && (
                        <WalletLayout path='/debit-card' component={DebitCard} />
                      )}
                      <WalletLayout path='/airdrops' component={Airdrops} />
                      <WalletLayout path='/exchange' component={TheExchange} />
                      <WalletLayout path='/home' component={Home} />
                      <WalletLayout path='/rewards' component={Interest} exact />
                      <WalletLayout path='/rewards/history' component={InterestHistory} />
                      <WalletLayout path='/security-center' component={SecurityCenter} />
                      <WalletLayout path='/settings/addresses' component={Addresses} />
                      <WalletLayout path='/settings/general' component={General} />
                      <WalletLayout path='/settings/preferences' component={Preferences} />
                      {walletConnectEnabled && (
                        <WalletLayout path='/dapps' component={WalletConnect} />
                      )}
                      <WalletLayout path='/prices' component={Prices} />
                      {taxCenterEnabled && (
                        <WalletLayout path='/tax-center' component={TaxCenter} />
                      )}
                      <WalletLayout
                        path='/coins/:coin'
                        component={coinViewV2 ? CoinPage : Transactions}
                        coinViewV2={coinViewV2}
                      />
                      {isAuthenticated ? <Redirect to='/home' /> : <Redirect to='/login' />}
                    </Switch>
                  </Suspense>
                </ConnectedRouter>
                {isAuthenticated && <SupportChat />}
                <SiftScience userId={userData.id} />
              </UrqlProvider>
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
  coinViewV2: selectors.core.walletOptions.getCoinViewV2(state).getOrElse(false) as boolean,
  isAuthenticated: selectors.auth.isAuthenticated(state) as boolean,
  nftExplorer: selectors.core.walletOptions.getNftExplorer(state).getOrElse(false) as boolean,
  taxCenterEnabled: selectors.core.walletOptions
    .getTaxCenterEnabled(state)
    .getOrElse(false) as boolean,
  userData: selectors.modules.profile.getUserData(state).getOrElse({} as UserDataType),
  walletConnectEnabled: selectors.core.walletOptions
    .getWalletConnectEnabled(state)
    .getOrElse(false) as boolean,
  walletDebitCardEnabled: selectors.core.walletOptions
    .getWalletDebitCardEnabled(state)
    .getOrElse(false)
})

const connector = connect(mapStateToProps)

type Props = {
  history: History
  persistor
  store: Store
} & ConnectedProps<typeof connector>

export default connector(App)
