import React, { Suspense, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { connect, ConnectedProps, Provider } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import { ThemeProvider as ConstellationTP } from '@blockchain-com/constellation'
import { ConnectedRouter } from 'connected-react-router'
import { Store } from 'redux'
import { PersistGate } from 'redux-persist/integration/react'
import Cookies from 'universal-cookie'
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
const SofiLanding = React.lazy(() => import('./SofiLanding'))
const SofiSignupSuccess = React.lazy(() => import('./Signup/SofiSignupSuccess'))
const SofiSignupFailure = React.lazy(() => import('./Signup/SofiSignupFailure'))
const SofiVerify = React.lazy(() => import('./Signup/components/SofiVerifySsn'))
const SofiReferral = React.lazy(() => import('./Refer/Sofi'))
const Prove = React.lazy(() => import('./Prove'))
// need to be authed to see this, but uses public layout
const ContinueOnPhone = React.lazy(() => import('./ContinueOnPhone'))
const TwoStepVerification = React.lazy(() => import('./TwoStepVerification'))
const UploadDocuments = React.lazy(() => import('./UploadDocuments'))
const UploadDocumentsForDebitCards = React.lazy(() => import('./UploadDocumentsForDebitCards'))
const UploadDocumentsSuccess = React.lazy(() => import('./UploadDocuments/Success'))
const VerifyAccountRecovery = React.lazy(() => import('./RecoverWallet/EmailAuthLanding'))
const VerifyEmailToken = React.lazy(() => import('./VerifyEmailToken'))
const VerifyEmail = React.lazy(() => import('./VerifyEmail'))

// TEST
const ContinueOnMobile = React.lazy(() => import('./Login/Sofi/ContinueOnMobile'))

// DEX
const Dex = React.lazy(() => import('./Dex'))

// NFTs
const NftsView = React.lazy(() => import('./Nfts/View'))
const NftsAsset = React.lazy(() => import('./Nfts/AssetViewOnly'))

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
  isMnemonicRecoveryEnabled,
  isNftExplorerEnabled,
  isProveEnabled,
  persistor,
  store,
  userDataId
}: Props) => {
  const Loading = isAuthenticated ? WalletLoading : AuthLoading
  const approvalDate = '4 March 2024'

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

  // effect for handling partner referrals
  useEffect(() => {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const referral = urlParams.get('ref')
    if (referral) {
      const cookies = new Cookies()
      cookies.set('partnerReferralCode', referral, {
        domain: '.blockchain.com',
        path: '/'
      })
    }
  }, [])

  const client = createClient({
    url: `${apiUrl}/nft-market-api/graphql/`
  })

  const isSofi = window.location.pathname === '/sofi'
  const isReferral = window.location.pathname === '/refer/sofi'

  const sofiParams = isSofi && window.location.search
  const referralParams = isReferral && window.location.search
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
                              <Route path='/app-error' component={AppError} />
                              <Route path='/refer/sofi' component={SofiReferral} exact />
                              <AuthLayout
                                path='/account-recovery'
                                component={VerifyAccountRecovery}
                                pageTitle={`${BLOCKCHAIN_TITLE} | Recovery`}
                              />
                              <AuthLayout
                                path='/continue-on-phone'
                                component={ContinueOnPhone}
                                pageTitle={`${BLOCKCHAIN_TITLE} | Continue on your phone`}
                              />
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
                              {isMnemonicRecoveryEnabled && (
                                <AuthLayout
                                  path='/recover'
                                  component={RecoverWallet}
                                  pageTitle={`${BLOCKCHAIN_TITLE} | Recover`}
                                />
                              )}
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
                                path='/setup-two-factor'
                                component={TwoStepVerification}
                                pageTitle={`${BLOCKCHAIN_TITLE} | Setup 2FA`}
                              />
                              <AuthLayout
                                path='/signup/sofi'
                                component={Signup}
                                pageTitle={`${BLOCKCHAIN_TITLE} | SoFi Signup`}
                              />
                              <AuthLayout
                                path='/login/sofi'
                                component={Login}
                                pageTitle={`${BLOCKCHAIN_TITLE} | SoFi Login`}
                              />
                              <AuthLayout
                                path='/sofi'
                                component={SofiLanding}
                                pageTitle={`${BLOCKCHAIN_TITLE} | SoFi Signup`}
                              />
                              <AuthLayout
                                path='/sofi-success'
                                component={SofiSignupSuccess}
                                pageTitle={`${BLOCKCHAIN_TITLE} | SoFi Signup`}
                              />
                              <AuthLayout
                                path='/sofi-error'
                                component={SofiSignupFailure}
                                pageTitle={`${BLOCKCHAIN_TITLE} | SoFi Signup`}
                              />
                              <AuthLayout
                                path='/sofi-verify'
                                component={SofiVerify}
                                pageTitle={`${BLOCKCHAIN_TITLE} | SoFi Signup`}
                              />
                              <AuthLayout
                                path='/sofi-mobile'
                                component={ContinueOnMobile}
                                pageTitle={`${BLOCKCHAIN_TITLE} | SoFi Signup`}
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
                              <AuthLayout
                                path='/upload-document/:token'
                                component={UploadDocuments}
                              />
                              <AuthLayout
                                path='/upload-document-card/:token'
                                component={UploadDocumentsForDebitCards}
                              />
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
                              {isProveEnabled && (
                                <AuthLayout
                                  path='/prove/instant-link/callback'
                                  component={Prove}
                                  pageTitle={`${BLOCKCHAIN_TITLE} | Verify Device`}
                                />
                              )}
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
                              <WalletLayout
                                path='/airdrops'
                                component={Airdrops}
                                hasUkBanner
                                approvalDate={approvalDate}
                              />
                              <WalletLayout path='/exchange' component={TheExchange} />
                              <WalletLayout
                                path='/home'
                                component={Home}
                                hasUkBanner
                                approvalDate={approvalDate}
                              />
                              <WalletLayout
                                path='/earn'
                                component={Earn}
                                exact
                                hasUkBanner
                                approvalDate={approvalDate}
                              />
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
                              <WalletLayout
                                path='/prices'
                                component={Prices}
                                hasUkBanner
                                approvalDate={approvalDate}
                              />
                              <WalletLayout path='/tax-center' component={TaxCenter} />
                              <WalletLayout
                                path='/coins/:coin'
                                component={isCoinViewV2Enabled ? CoinPage : Transactions}
                                hideMenu={isCoinViewV2Enabled}
                                center={isCoinViewV2Enabled}
                                removeContentPadding
                                hasUkBanner
                              />
                              {isSofi && window.location.replace(`/#/sofi${sofiParams}`)}
                              {isReferral &&
                                window.location.replace(`/#/refer/sofi${referralParams}`)}
                              {isAuthenticated ? <Redirect to='/home' /> : <Redirect to='/login' />}
                            </Switch>
                          </Suspense>
                        </ConnectedRouter>
                        <SiftScience userId={userDataId} />
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
  isAuthenticated: selectors.auth.isAuthenticated(state),
  isCoinViewV2Enabled: selectors.core.walletOptions
    .getCoinViewV2(state)
    .getOrElse(false) as boolean,
  isDebitCardEnabled: selectors.core.walletOptions
    .getWalletDebitCardEnabled(state)
    .getOrElse(false),
  isDexEnabled: selectors.core.walletOptions
    .getDexProductEnabled(state)
    .getOrElse(false) as boolean,
  isMnemonicRecoveryEnabled: selectors.core.walletOptions
    .getMnemonicRecoveryEnabled(state)
    .getOrElse(false) as boolean,
  isNftExplorerEnabled: selectors.core.walletOptions
    .getNftExplorer(state)
    .getOrElse(false) as boolean,
  isProveEnabled: selectors.core.walletOptions.getProveEnabled(state).getOrElse(false) as boolean,
  userDataId: selectors.modules.profile.getUserData(state).getOrElse({} as UserDataType).id
})

const connector = connect(mapStateToProps)

type Props = {
  history: History
  persistor
  store: Store
} & ConnectedProps<typeof connector>

export default connector(App)
