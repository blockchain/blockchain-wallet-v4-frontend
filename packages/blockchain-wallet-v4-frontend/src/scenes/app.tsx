import { connect, ConnectedProps, Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { createGlobalStyle } from 'styled-components'
import { FontGlobalStyles, IconGlobalStyles } from 'blockchain-info-components'
import { has, map, values } from 'ramda'
import { MediaContextProvider } from 'providers/MatchMediaProvider'
import { PersistGate } from 'redux-persist/integration/react'
import { Redirect, Switch } from 'react-router-dom'
import { selectors } from 'data'
import Addresses from './Settings/Addresses'
import Airdrops from './Airdrops'
import AnalyticsTracker from 'providers/AnalyticsTracker'
import AuthorizeLogin from './AuthorizeLogin'
import Borrow from './Borrow'
import Exchange from './Exchange'
import ExchangeHistory from './ExchangeHistory'
import ExchangeProfile from './ExchangeProfile'
import General from './Settings/General'
import Help from './Help'
import Home from './Home'
import Lockbox from './Lockbox'
import Login from './Login'
import Logout from './Logout'
import MobileLogin from './MobileLogin'
import Preferences from './Settings/Preferences'
import Profile from './Settings/Profile'
import PublicLayout from 'layouts/Public'
import React from 'react'
import Recover from './Recover'
import Register from './Register'
import Reminder from './Reminder'
import Reset2FA from './Reset2FA'
import Reset2FAToken from './Reset2FAToken'
import SecurityCenter from './SecurityCenter'
import TheExchange from './TheExchange'
import ThemeProvider from 'providers/ThemeProvider'
import Transactions from './Transactions'
import TranslationsProvider from 'providers/TranslationsProvider'
import UploadDocuments from './UploadDocuments'
import UploadDocumentsSuccess from './UploadDocuments/Success'
import VerifyEmailToken from './VerifyEmailToken'
import WalletLayout from 'layouts/Wallet'

const GlobalStyle = createGlobalStyle`
  html, body, #app, #app > div {padding: 0; margin: 0; height: 100%;}
  html, body {overflow: hidden;}
  /* hide scrollbars */
  ::-webkit-scrollbar {
    display: none;
  }
  * {
    scrollbar-width: none;
    -ms-overflow-style: none;
    -webkit-font-smoothing: antialiased;
  }
`

class App extends React.PureComponent<Props> {
  render () {
    const {
      store,
      history,
      persistor,
      isAuthenticated,
      supportedCoins
    } = this.props
    return (
      <Provider store={store}>
        <TranslationsProvider>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider>
              <MediaContextProvider>
                <ConnectedRouter history={history}>
                  <Switch>
                    <PublicLayout path='/login' component={Login} />
                    <PublicLayout path='/logout' component={Logout} />
                    <PublicLayout path='/help' component={Help} />
                    <PublicLayout path='/recover' component={Recover} />
                    <PublicLayout path='/reminder' component={Reminder} />
                    <PublicLayout path='/reset-2fa' component={Reset2FA} />
                    <PublicLayout
                      path='/mobile-login'
                      component={MobileLogin}
                    />
                    <PublicLayout
                      path='/reset-two-factor'
                      component={Reset2FAToken}
                    />
                    <PublicLayout
                      path='/verify-email'
                      component={VerifyEmailToken}
                    />
                    <PublicLayout path='/signup' component={Register} />
                    <PublicLayout
                      path='/authorize-approve'
                      component={AuthorizeLogin}
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
                    <WalletLayout path='/home' component={Home} />
                    <WalletLayout
                      path='/swap/history'
                      component={ExchangeHistory}
                    />
                    <WalletLayout
                      path='/swap/profile'
                      component={ExchangeProfile}
                    />
                    <WalletLayout path='/airdrops' component={Airdrops} />
                    <WalletLayout path='/borrow' component={Borrow} />
                    <WalletLayout path='/swap' component={Exchange} exact />
                    <WalletLayout path='/exchange' component={TheExchange} />
                    <WalletLayout
                      path='/security-center'
                      component={SecurityCenter}
                    />
                    <WalletLayout
                      path='/settings/preferences'
                      component={Preferences}
                    />
                    <WalletLayout
                      path='/settings/profile'
                      component={Profile}
                    />
                    <WalletLayout
                      path='/settings/addresses'
                      component={Addresses}
                    />
                    <WalletLayout
                      path='/settings/general'
                      component={General}
                    />
                    <WalletLayout path='/lockbox' component={Lockbox} />
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
                              // key={coin.coinCode}
                            />
                          ),
                        supportedCoins
                      )
                    )}
                    {isAuthenticated ? (
                      <Redirect from='/' to='/home' />
                    ) : (
                      <Redirect from='/' to='/login' />
                    )}
                  </Switch>
                </ConnectedRouter>
                <AnalyticsTracker />
                <FontGlobalStyles />
                <IconGlobalStyles />
                <GlobalStyle />
              </MediaContextProvider>
            </ThemeProvider>
          </PersistGate>
        </TranslationsProvider>
      </Provider>
    )
  }
}

const mapStateToProps = state => ({
  isAuthenticated: selectors.auth.isAuthenticated(state),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
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
