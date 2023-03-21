import React, { Suspense, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { connect, ConnectedProps, Provider } from 'react-redux'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import { ThemeProvider as ConstellationTP } from '@blockchain-com/constellation'
import { ConnectedRouter } from 'connected-react-router'
import { Store } from 'redux'
import { PersistGate } from 'redux-persist/integration/react'
import { createClient, Provider as UrqlProvider } from 'urql'

import { WalletOptionsType } from '@core/types'
import { NabuErrorDeepLinkHandler } from 'components/NabuErrorDeepLinkHandler'
import SiftScience from 'components/SiftScience'
import { selectors } from 'data'
import { UserDataType } from 'data/types'
import { useDefer3rdPartyScript } from 'hooks'
import AuthLayout from 'layouts/Auth'
import AuthLoading from 'layouts/Auth/template.loading'
import DexLayout from 'layouts/Dex'
import NftsLayout from 'layouts/Nfts'
import WalletLayout from 'layouts/Wallet'
import WalletLoading from 'layouts/Wallet/template.loading'
import { UTM } from 'middleware/analyticsMiddleware/constants'
import { utmParser } from 'middleware/analyticsMiddleware/utils'
import { MediaContextProvider } from 'providers/MatchMediaProvider'
import { RemoteConfigProvider } from 'providers/RemoteConfigProvider'
import ThemeProvider from 'providers/ThemeProvider'
import TranslationsProvider from 'providers/TranslationsProvider'
import { getTracking } from 'services/tracking'

const queryClient = new QueryClient()

// PUBLIC
const AppError = React.lazy(() => import('./AppError'))
const AuthorizeLogin = React.lazy(() => import('./AuthorizeLogin'))
const Help = React.lazy(() => import('./Help'))
const HelpExchange = React.lazy(() => import('./HelpExchange'))
const Login = React.lazy(() => import('./Login'))
const Logout = React.lazy(() => import('./Logout'))
const MobileLogin = React.lazy(() => import('./MobileLogin'))
const ProductPicker = React.lazy(() => import('./Signup/ProductPicker'))
const RecoverWallet = React.lazy(() => import('./RecoverWallet'))
const Signup = React.lazy(() => import('./Signup'))
const ResetWallet2fa = React.lazy(() => import('./ResetWallet2fa'))
const ResetWallet2faToken = React.lazy(() => import('./ResetWallet2faToken'))
// need to be authed to see this, but uses public layout
const TwoStepVerification = React.lazy(() => import('./TwoStepVerification'))
const UploadDocuments = React.lazy(() => import('./UploadDocuments'))
const UploadDocumentsForDebitCards = React.lazy(() => import('./UploadDocumentsForDebitCards'))
const UploadDocumentsSuccess = React.lazy(() => import('./UploadDocuments/Success'))
const VerifyAccountRecovery = React.lazy(() => import('./RecoverWallet/EmailAuthLanding'))
const VerifyEmailToken = React.lazy(() => import('./VerifyEmailToken'))
const VerifyEmail = React.lazy(() => import('./VerifyEmail'))

// DEX
const Dex = React.lazy(() => import('./Dex'))

// NFTs
const NftsView = React.lazy(() => import('./Nfts/View'))
const NftsFirehose = React.lazy(() => import('./Nfts/Firehose'))
const NftsCollection = React.lazy(() => import('./Nfts/Collection/Collection'))
const NftsAsset = React.lazy(() => import('./Nfts/AssetViewOnly'))
const NftsAddress = React.lazy(() => import('./Nfts/Address/Address'))
const NftsSettings = React.lazy(() => import('./Nfts/Settings'))

// WALLET
const Addresses = React.lazy(() => import('./Settings/Addresses'))
const Airdrops = React.lazy(() => import('./Airdrops'))
const CoinPage = React.lazy(() => import('./CoinPage/components/CoinPage'))
const General = React.lazy(() => import('./Settings/General'))
const Home = React.lazy(() => import('./Home'))
const Earn = React.lazy(() => import('./Earn'))
const EarnHistory = React.lazy(() => import('./EarnHistory'))
const ActiveRewardsLearn = React.lazy(() => import('./ActiveRewardsLearn'))
const Preferences = React.lazy(() => import('./Settings/Preferences'))
const Prices = React.lazy(() => import('./Prices'))
const SecurityCenter = React.lazy(() => import('./SecurityCenter'))
const TaxCenter = React.lazy(() => import('./TaxCenter'))
const TheExchange = React.lazy(() => import('./TheExchange'))
const Transactions = React.lazy(() => import('./Transactions'))
const DebitCard = React.lazy(() => import('./DebitCard'))

const BLOCKCHAIN_TITLE = 'Blockchain.com'

const App = ({
  apiUrl,
  history,
  isActiveRewardsEnabled,
  isAuthenticated,
  isCoinViewV2Enabled,
  isDebitCardEnabled,
  isDexEnabled,
  isNftExplorerEnabled,
  persistor,
  store,
  userData
}: Props) => {
  const Loading = isAuthenticated ? WalletLoading : AuthLoading
  // parse and log UTMs
  useEffect(() => {
    const utm = utmParser()
    sessionStorage.setItem(UTM, JSON.stringify(utm))
    getTracking({ url: apiUrl })
  }, [apiUrl])

  // lazy load google tag manager
  useDefer3rdPartyScript('https://www.googletagmanager.com/gtag/js?id=UA-52108117-5', {
    attributes: {
      nonce: window.nonce
    }
  })

  const client = createClient({
    url: `${apiUrl}/nft-market-api/graphql/`
  })

  const location = useLocation()

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <NabuErrorDeepLinkHandler>
          <RemoteConfigProvider>
            <ConstellationTP colorMode='light'>
              <ThemeProvider>
                <TranslationsProvider>
                  <PersistGate loading={<Loading />} persistor={persistor}>
                    <MediaContextProvider>
                      <UrqlProvider value={client}>
                        <ConnectedRouter history={history}>
                          <Suspense fallback={<Loading />}>
                            <Switch>
                              {/* Unauthenticated Wallet routes */}
                              <Route path='/app-error'>
                                <AppError />
                              </Route>
                              <AuthLayout
                                path='/account-recovery'
                                pageTitle={`${BLOCKCHAIN_TITLE} | Recovery`}
                              >
                                <VerifyAccountRecovery />
                              </AuthLayout>
                              <AuthLayout path='/authorize-approve'>
                                <AuthorizeLogin location={location} />
                              </AuthLayout>
                              <AuthLayout path='/help' pageTitle={`${BLOCKCHAIN_TITLE} | Help`}>
                                <Help />
                              </AuthLayout>
                              <AuthLayout
                                path='/help-exchange'
                                pageTitle={`${BLOCKCHAIN_TITLE} | Help`}
                              >
                                <HelpExchange />
                              </AuthLayout>
                              <AuthLayout path='/login' pageTitle={`${BLOCKCHAIN_TITLE} | Login`}>
                                <Login />
                              </AuthLayout>
                              <AuthLayout path='/logout'>
                                <Logout />
                              </AuthLayout>
                              <AuthLayout
                                path='/select-product'
                                pageTitle={`${BLOCKCHAIN_TITLE} | Product Select`}
                              >
                                <ProductPicker />
                              </AuthLayout>
                              <AuthLayout
                                path='/mobile-login'
                                pageTitle={`${BLOCKCHAIN_TITLE} | Login`}
                              >
                                <MobileLogin />
                              </AuthLayout>
                              <AuthLayout
                                path='/recover'
                                pageTitle={`${BLOCKCHAIN_TITLE} | Recover`}
                              >
                                <RecoverWallet />
                              </AuthLayout>
                              <AuthLayout
                                path='/reset-2fa'
                                pageTitle={`${BLOCKCHAIN_TITLE} | Reset 2FA`}
                              >
                                <ResetWallet2fa />
                              </AuthLayout>
                              <AuthLayout
                                path='/reset-two-factor'
                                pageTitle={`${BLOCKCHAIN_TITLE} | Reset 2FA`}
                              >
                                <ResetWallet2faToken />
                              </AuthLayout>
                              <AuthLayout
                                path='/setup-two-factor'
                                pageTitle={`${BLOCKCHAIN_TITLE} | Setup 2FA`}
                              >
                                <TwoStepVerification />
                              </AuthLayout>
                              {/* leaving this one with component
                              until upgrading to react router 6 */}
                              <AuthLayout
                                path='/signup'
                                pageTitle={`${BLOCKCHAIN_TITLE} | Sign up`}
                              >
                                {/* @ts-ignore */}
                                <Signup />
                              </AuthLayout>

                              <AuthLayout
                                path='/verify-email'
                                pageTitle={`${BLOCKCHAIN_TITLE} | Verify Email`}
                              >
                                <VerifyEmailToken location={location} />
                              </AuthLayout>
                              <AuthLayout path='/upload-document/success' exact>
                                <UploadDocumentsSuccess />
                              </AuthLayout>
                              <AuthLayout path='/upload-document/:token'>
                                <UploadDocuments />
                              </AuthLayout>
                              <AuthLayout path='/upload-document-card/:token'>
                                <UploadDocumentsForDebitCards />
                              </AuthLayout>
                              <AuthLayout path='/wallet' pageTitle={`${BLOCKCHAIN_TITLE} | Login`}>
                                <Login />
                              </AuthLayout>
                              <AuthLayout
                                path='/verify-email-step'
                                pageTitle={`${BLOCKCHAIN_TITLE} | Verify Email`}
                              >
                                <VerifyEmail />
                              </AuthLayout>

                              {/* DEX routes */}
                              {isDexEnabled && (
                                <DexLayout
                                  path='/dex'
                                  exact
                                  component={Dex}
                                  pageTitle={`${BLOCKCHAIN_TITLE} | DEX`}
                                />
                              )}
                              {/* NFT Explorer routes */}
                              {isNftExplorerEnabled && (
                                <NftsLayout
                                  path='/nfts/assets/:contract/:id'
                                  exact
                                  component={NftsAsset}
                                />
                              )}
                              <Route exact path='/nfts'>
                                <Redirect to='/nfts/view' />
                              </Route>
                              {isNftExplorerEnabled && (
                                <NftsLayout
                                  path='/nfts/view'
                                  exact
                                  component={NftsView}
                                  pageTitle={`${BLOCKCHAIN_TITLE} | NFT Explorer`}
                                />
                              )}
                              {/* Authenticated Wallet routes */}
                              {isDebitCardEnabled && (
                                <WalletLayout path='/debit-card' component={DebitCard} />
                              )}
                              <WalletLayout path='/airdrops' component={Airdrops} />
                              <WalletLayout path='/exchange' component={TheExchange} />
                              <WalletLayout path='/home' component={Home} />
                              <WalletLayout path='/earn' component={Earn} exact />
                              <WalletLayout path='/earn/history' component={EarnHistory} />
                              {isActiveRewardsEnabled && (
                                <WalletLayout
                                  path='/earn/active-rewards-learn'
                                  component={ActiveRewardsLearn}
                                />
                              )}
                              <WalletLayout path='/security-center' component={SecurityCenter} />
                              <WalletLayout path='/settings/addresses' component={Addresses} />
                              <WalletLayout path='/settings/general' component={General} />
                              <WalletLayout path='/settings/preferences' component={Preferences} />
                              <WalletLayout path='/prices' component={Prices} />
                              <WalletLayout path='/tax-center' component={TaxCenter} />
                              <WalletLayout
                                path='/coins/:coin'
                                component={isCoinViewV2Enabled ? CoinPage : Transactions}
                                hideMenu={isCoinViewV2Enabled}
                                center={isCoinViewV2Enabled}
                                removeContentPadding
                              />
                              {isAuthenticated ? <Redirect to='/home' /> : <Redirect to='/login' />}
                            </Switch>
                          </Suspense>
                        </ConnectedRouter>
                        <SiftScience userId={userData.id} />
                      </UrqlProvider>
                    </MediaContextProvider>
                  </PersistGate>
                </TranslationsProvider>
              </ThemeProvider>
            </ConstellationTP>
          </RemoteConfigProvider>
        </NabuErrorDeepLinkHandler>
      </Provider>
    </QueryClientProvider>
  )
}

const mapStateToProps = (state) => ({
  apiUrl: selectors.core.walletOptions.getDomains(state).getOrElse({
    api: 'https://api.blockchain.info'
  } as WalletOptionsType['domains']).api,
  isActiveRewardsEnabled: selectors.core.walletOptions
    .getActiveRewardsEnabled(state)
    .getOrElse(false) as boolean,
  isAuthenticated: selectors.auth.isAuthenticated(state) as boolean,
  isCoinDataLoaded: selectors.core.data.coins.getIsCoinDataLoaded(state),
  isCoinViewV2Enabled: selectors.core.walletOptions
    .getCoinViewV2(state)
    .getOrElse(false) as boolean,
  isDebitCardEnabled: selectors.core.walletOptions
    .getWalletDebitCardEnabled(state)
    .getOrElse(false),
  isDexEnabled: selectors.core.walletOptions
    .getDexProductEnabled(state)
    .getOrElse(false) as boolean,
  isNftExplorerEnabled: selectors.core.walletOptions
    .getNftExplorer(state)
    .getOrElse(false) as boolean,
  userData: selectors.modules.profile.getUserData(state).getOrElse({} as UserDataType)
})

const connector = connect(mapStateToProps)

type Props = {
  history: History
  persistor
  store: Store
} & ConnectedProps<typeof connector>

export default connector(App)
