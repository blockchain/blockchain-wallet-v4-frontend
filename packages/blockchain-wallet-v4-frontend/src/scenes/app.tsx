import React, { lazy, Suspense, useEffect } from 'react'
import { connect, ConnectedProps, Provider } from 'react-redux'
import { Redirect, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import { Store } from 'redux'
import { PersistGate } from 'redux-persist/integration/react'

import { WalletOptionsType } from '@core/types'
import SiftScience from 'components/SiftScience'
import SupportChat from 'components/SupportChat'
import { selectors } from 'data'
import { UserDataType } from 'data/types'
import PublicLayout from 'layouts/Public'
import PublicLoading from 'layouts/Public/template.loading'
import WalletLayout from 'layouts/Wallet'
import WalletLoading from 'layouts/Wallet/template.loading'
import { UTM } from 'middleware/analyticsMiddleware/constants'
import { utmParser } from 'middleware/analyticsMiddleware/utils'
import { MediaContextProvider } from 'providers/MatchMediaProvider'
import ThemeProvider from 'providers/ThemeProvider'
import TranslationsProvider from 'providers/TranslationsProvider'
import { getTracking } from 'services/tracking'

const BLOCKCHAIN_TITLE = 'Blockchain.com'

const App = ({
  apiUrl,
  coinViewV2,
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

  // parse and log UTMs
  useEffect(() => {
    const utm = utmParser()
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
                    <PublicLayout
                      path='/authorize-approve'
                      component={lazy(() => import('./AuthorizeLogin'))}
                    />
                    <PublicLayout
                      path='/help'
                      component={lazy(() => import('./Help'))}
                      pageTitle={`${BLOCKCHAIN_TITLE} | Help`}
                    />
                    <PublicLayout
                      path='/help-exchange'
                      component={lazy(() => import('./HelpExchange'))}
                      pageTitle={`${BLOCKCHAIN_TITLE} | Help`}
                    />
                    <PublicLayout
                      path='/login'
                      component={lazy(() => import('./Login'))}
                      pageTitle={`${BLOCKCHAIN_TITLE} | Login`}
                    />
                    <PublicLayout path='/logout' component={lazy(() => import('./Logout'))} />
                    <PublicLayout
                      path='/select-product'
                      component={lazy(() => import('./ProductPicker'))}
                      pageTitle={`${BLOCKCHAIN_TITLE} | Product Select`}
                    />
                    <PublicLayout
                      path='/mobile-login'
                      component={lazy(() => import('./MobileLogin'))}
                      pageTitle={`${BLOCKCHAIN_TITLE} | Login`}
                    />
                    <PublicLayout
                      path='/recover'
                      component={lazy(() => import('./RecoverWallet'))}
                      pageTitle={`${BLOCKCHAIN_TITLE} | Recover`}
                    />
                    <PublicLayout
                      path='/reset-2fa'
                      component={lazy(() => import('./ResetWallet2fa'))}
                      pageTitle={`${BLOCKCHAIN_TITLE} | Reset 2FA`}
                    />
                    <PublicLayout
                      path='/reset-two-factor'
                      component={lazy(() => import('./ResetWallet2faToken'))}
                      pageTitle={`${BLOCKCHAIN_TITLE} | Reset 2FA`}
                    />
                    <PublicLayout
                      path='/signup'
                      component={lazy(() => import('./Signup'))}
                      pageTitle={`${BLOCKCHAIN_TITLE} | Sign up`}
                    />
                    <PublicLayout
                      path='/verify-email'
                      component={lazy(() => import('./VerifyEmailToken'))}
                      pageTitle={`${BLOCKCHAIN_TITLE} | Verify Email`}
                    />
                    <PublicLayout
                      path='/upload-document/success'
                      component={lazy(() => import('./UploadDocuments/Success'))}
                      exact
                    />
                    <PublicLayout
                      path='/upload-document/:token'
                      component={lazy(() => import('./UploadDocuments'))}
                    />
                    <PublicLayout
                      path='/wallet'
                      component={lazy(() => import('./Login'))}
                      pageTitle={`${BLOCKCHAIN_TITLE} | Login`}
                    />
                    <PublicLayout
                      path='/verify-email-step'
                      component={lazy(() => import('./VerifyEmail'))}
                      pageTitle={`${BLOCKCHAIN_TITLE} | Verify Email`}
                    />
                    {walletDebitCardEnabled && (
                      <WalletLayout
                        path='/debitCard'
                        component={lazy(() => import('./DebitCard'))}
                      />
                    )}
                    <WalletLayout path='/airdrops' component={lazy(() => import('./Airdrops'))} />
                    <WalletLayout
                      path='/exchange'
                      component={lazy(() => import('./TheExchange'))}
                    />
                    <WalletLayout path='/home' component={lazy(() => import('./Home'))} />
                    <WalletLayout
                      path='/rewards'
                      component={lazy(() => import('./Interest'))}
                      exact
                    />
                    <WalletLayout
                      path='/rewards/history'
                      component={lazy(() => import('./InterestHistory'))}
                    />
                    <WalletLayout path='/nfts' component={lazy(() => import('./Nfts'))} />
                    <WalletLayout
                      path='/security-center'
                      component={lazy(() => import('./SecurityCenter'))}
                    />
                    <WalletLayout
                      path='/settings/addresses'
                      component={lazy(() => import('./Settings/Addresses'))}
                    />
                    <WalletLayout
                      path='/settings/general'
                      component={lazy(() => import('./Settings/General'))}
                    />
                    <WalletLayout
                      path='/settings/preferences'
                      component={lazy(() => import('./Settings/Preferences'))}
                    />
                    {walletConnectEnabled && (
                      <WalletLayout
                        path='/dapps'
                        component={lazy(() => import('./WalletConnect'))}
                      />
                    )}
                    <WalletLayout path='/prices' component={lazy(() => import('./Prices'))} />
                    {taxCenterEnabled && (
                      <WalletLayout
                        path='/tax-center'
                        component={lazy(() => import('./TaxCenter'))}
                      />
                    )}
                    <WalletLayout
                      path='/coins/:coin'
                      component={
                        coinViewV2
                          ? lazy(() => import('./CoinPage/components/CoinPage'))
                          : lazy(() => import('./Transactions'))
                      }
                      coinViewV2={coinViewV2}
                    />
                    {isAuthenticated ? <Redirect to='/home' /> : <Redirect to='/login' />}
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
  coinViewV2: selectors.core.walletOptions.getCoinViewV2(state).getOrElse(false) as boolean,
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
