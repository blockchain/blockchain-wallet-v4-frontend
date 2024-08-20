import React, { Suspense, useEffect, useMemo, useState } from 'react'
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
import { languages } from 'services/locales'
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

const removeHash = (path: string) => {
  if (path.startsWith('/#')) return path.slice(2)
  if (path.endsWith('#/')) return path.slice(0, -2)
  if (path.includes('/#/')) return path.replace('/#/', '/')
  return path
}

const useStaging = window.location.host === 'login-staging.blockchain.com'

const useFullPathForRedirect = [
  '/#/authorize-approve',
  '/deeplink',
  '/exchange',
  '/prove/instant-link/callback',
  '/refer',
  '/sofi',
  '/#/verify-email',
  '/#/login?product=exchange',
  '/wallet-options-v4.json',
  '/#/prove',
  '/#/reset-two-factor',
  '/#/open',
  '/forgot-password',
  '/import-wallet'
]

const excludedProduction = [
  '/#/authorize-approve',
  '/deeplink',
  '/exchange',
  '/prove/instant-link/callback',
  '/refer',
  '/sofi',
  '/#/verify-email',
  '/#/login?product=exchange',
  '/wallet-options-v4.json',
  '/#/prove',
  '/#/reset-two-factor',
  '/#/open'
]

const excludedStaging = [
  // '/#/authorize-approve',
  // '/deeplink',
  '/exchange',
  '/prove/instant-link/callback',
  '/refer',
  '/sofi',
  // '/#/verify-email',
  '/#/login?product=exchange',
  '/wallet-options-v4.json',
  '/#/prove',
  // '/#/reset-two-factor'
  '/#/open'
]

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
  const [isDynamicRoutingInProgress, setDynamicRoutingState] = useState<boolean>(true)

  useEffect(() => {
    // Used to get cached values from old implementation, if they exist.
    const cookies = new Cookies()
    const optOut = localStorage.getItem('opt_out_wallet_v5_ui')
    const optOutDate = localStorage.getItem('opt_out_date')
    const cache = {
      canary_position: cookies.get('canary_position'),
      opt_out_wallet_v5_ui: cookies.get('opt_out_wallet_v5_ui')
    }

    // Update localStorage cache with current values, if exists.
    if (localStorage.getItem('canary_position') === null && cache.canary_position) {
      localStorage.setItem('canary_position', `${cache.canary_position}`)
    }

    // Update localStorage cache with current values, if exists.
    if (optOut === null && cache.opt_out_wallet_v5_ui) {
      localStorage.setItem('opt_out_wallet_v5_ui', JSON.stringify(cache.opt_out_wallet_v5_ui))
    }

    if (optOut && optOutDate === null) {
      localStorage.setItem('opt_out_date', new Date().toISOString())
    }

    // OBTAIN THE THRESHOLD - STATICALLY SET, DECIDED BY TEAM.
    const THRESHOLD = 30

    // THE DYNAMIC ROUTING IS DISABLED, SEND TO V4
    // @ts-ignore
    if (THRESHOLD === 0) {
      localStorage.setItem('wallet_v5_ui_available', 'false')
      // eslint-disable-next-line
      console.log('[ROUTING_DEBUG]: Threshold was not set, assuming v5 is disabled.')
      setDynamicRoutingState(false)
      return
    }

    // OBTAIN FULL PATH BY COMBINING PATHNAME AND HASH (CLIENT-ONLY ROUTING)
    let fullPath = (window.location.pathname + window.location.hash).toLowerCase()
    const fullPathCaseSensitive = window.location.pathname + window.location.hash

    // SPLIT IT INTO PARTS TO HANDLE LANGUAGE DETECTION
    const pathSegments = fullPath.split('/').filter(Boolean)
    const firstSegment = pathSegments[0]?.toLowerCase()

    // IF LANGUAGE EXISTS, REMOVE IT FROM THE PATH, NOT NEEDED FOR DYNAMIC ROUTING.
    if (languages.some((lang) => lang.language.toLowerCase() === firstSegment)) {
      // HACK TO ENSURE CORRECT DOMAIN/PATH SET
      languages.forEach(({ language }) => {
        cookies.remove('clang', { domain: '.blockchain.com', path: `/${language}` })
      })

      // UPDATE LANGUAGE COOKIE SO THAT V5 LOADS THE CORRECT LANGUAGE
      cookies.set('clang', firstSegment.toLowerCase(), {
        domain: '.blockchain.com',
        path: '/'
      })
      // Remove the first segment and join the remaining segments
      pathSegments.shift()
      fullPath = `/${pathSegments.join('/')}`
    }

    // IF ANY PATHS MATCH THE EXCLUSIONS, RENDER THE APP.
    if (
      (useStaging ? excludedStaging : excludedProduction).some((prefix) => {
        return fullPath.startsWith(prefix)
      })
    ) {
      setDynamicRoutingState(false)
      return
    }

    // OBTAIN THE CANARY POSITION
    const canaryPositionString = localStorage.getItem('canary_position')
    let canaryPosition = Number(canaryPositionString)

    const setCanaryPosition = () => {
      canaryPosition = Math.floor(Math.random() * 101)
      localStorage.setItem('canary_position', `${canaryPosition}`)
    }

    // IF THE CANARY POSITION DOES NOT EXIST, GENERATE A NEW ONE.
    if (canaryPositionString === null || canaryPositionString === undefined) setCanaryPosition()

    // MAKE SURE THE CANARY POSITION IS VALID, IF NOT, UPDATE THE VALUE.
    if (Number.isNaN(canaryPosition)) {
      // eslint-disable-next-line
      console.log(
        `[ROUTING_DEBUG]: canary_position was NaN, Raw: ${canaryPositionString}, Setting a new canary_position.`
      )
      setCanaryPosition()
      // eslint-disable-next-line
      console.log(`[ROUTING_DEBUG]: Set canary_position to ${canaryPosition}`)
    }

    // IF THE USER HAS REQUESTED TO STAY IN V4.
    const reversionRequested = localStorage.getItem('opt_out_wallet_v5_ui') === 'true'
    const availableUI = canaryPosition <= THRESHOLD

    // USER HAS SPECIFICALLY REQUESTED TO STAY ON V4.
    if (reversionRequested) {
      localStorage.setItem('wallet_v5_ui_available', availableUI ? 'true' : 'false')
      // eslint-disable-next-line
      console.log('[ROUTING_DEBUG]: User has opted out of v5, staying on v4')
      setDynamicRoutingState(false)
      return
    }

    // RATHER OR NOT V5 IS AVAILABLE
    localStorage.setItem('wallet_v5_ui_available', availableUI ? 'true' : 'false')

    if (availableUI) {
      // eslint-disable-next-line
      console.log('Redirecting to v5')
      // Using **WALLET_V5_LINK** as a fallback for webpack builder.
      if (useFullPathForRedirect.some((prefix) => fullPath.startsWith(prefix))) {
        window.location.href = `${window?.WALLET_V5_LINK + removeHash(fullPathCaseSensitive)}`
      } else {
        window.location.href = window?.WALLET_V5_LINK
      }

      return
    }

    setDynamicRoutingState(false)
  }, [])

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

  const RoutingStack = useMemo(
    () => (
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
        <AuthLayout path='/help' component={Help} pageTitle={`${BLOCKCHAIN_TITLE} | Help`} />
        <AuthLayout
          path='/help-exchange'
          component={HelpExchange}
          pageTitle={`${BLOCKCHAIN_TITLE} | Help`}
        />
        <AuthLayout path='/login' component={Login} pageTitle={`${BLOCKCHAIN_TITLE} | Login`} />
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
        <AuthLayout path='/signup' component={Signup} pageTitle={`${BLOCKCHAIN_TITLE} | Sign up`} />
        <AuthLayout
          path='/verify-email'
          component={VerifyEmailToken}
          pageTitle={`${BLOCKCHAIN_TITLE} | Verify Email`}
        />
        <AuthLayout path='/upload-document/success' component={UploadDocumentsSuccess} exact />
        <AuthLayout path='/upload-document/:token' component={UploadDocuments} />
        <AuthLayout path='/upload-document-card/:token' component={UploadDocumentsForDebitCards} />
        <AuthLayout path='/wallet' component={Login} pageTitle={`${BLOCKCHAIN_TITLE} | Login`} />
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
          <DexLayout path='/dex' exact component={Dex} pageTitle={`${BLOCKCHAIN_TITLE} | DEX`} />
        )}
        {/* NFT Explorer routes */}
        {isNftExplorerEnabled && (
          <NftsLayout path='/nfts/assets/:contract/:id' exact component={NftsAsset} />
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
        {isDebitCardEnabled && <WalletLayout path='/debit-card' component={DebitCard} />}
        <WalletLayout
          path='/airdrops'
          component={Airdrops}
          hasUkBanner
          approvalDate={approvalDate}
        />
        <WalletLayout path='/exchange' component={TheExchange} />
        <WalletLayout path='/home' component={Home} hasUkBanner approvalDate={approvalDate} />
        <WalletLayout path='/earn' component={Earn} exact hasUkBanner approvalDate={approvalDate} />
        <WalletLayout path='/earn/history' component={EarnHistory} />
        {isActiveRewardsEnabled && (
          <WalletLayout path='/earn/active-rewards-learn' component={ActiveRewardsLearn} />
        )}
        <WalletLayout path='/security-center' component={SecurityCenter} />
        <WalletLayout path='/settings/addresses' component={Addresses} />
        <WalletLayout path='/settings/general' component={General} />
        <WalletLayout path='/settings/preferences' component={Preferences} />
        <WalletLayout path='/prices' component={Prices} hasUkBanner approvalDate={approvalDate} />
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
        {isReferral && window.location.replace(`/#/refer/sofi${referralParams}`)}
        {isAuthenticated ? <Redirect to='/home' /> : <Redirect to='/login' />}
      </Switch>
    ),
    [
      isActiveRewardsEnabled,
      isAuthenticated,
      isCoinViewV2Enabled,
      isDebitCardEnabled,
      isDexEnabled,
      isMnemonicRecoveryEnabled,
      isNftExplorerEnabled,
      isProveEnabled,
      isReferral,
      isSofi,
      referralParams,
      sofiParams
    ]
  )

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
                            {isDynamicRoutingInProgress ? <Loading /> : RoutingStack}
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

type Props = {
  history: History
  persistor
  store: Store
} & ConnectedProps<typeof connector>
const connector = connect(mapStateToProps)
export default connector(App)
