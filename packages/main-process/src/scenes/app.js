import React, { useEffect } from 'react'
import { Redirect, Switch } from 'react-router-dom'
import { connect, Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { map, values } from 'ramda'
import { createGlobalStyle } from 'styled-components'

import { selectors } from 'data'
import { IconGlobalStyles, FontGlobalStyles } from 'blockchain-info-components'
import { MediaContextProvider } from 'providers/MatchMediaProvider'
import AnalyticsTracker from 'providers/AnalyticsTracker'
import TranslationsProvider from 'providers/TranslationsProvider'
import PublicLayout from 'layouts/Public'
import ThemeProvider from 'providers/ThemeProvider'
import WalletLayout from 'layouts/Wallet'

import Addresses from './Settings/Addresses'
import AuthorizeLogin from './AuthorizeLogin'
import BuySell from './BuySell'
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
import Recover from './Recover'
import Register from './Register'
import Reminder from './Reminder'
import Reset2FA from './Reset2FA'
import Reset2FAToken from './Reset2FAToken'
import SecurityCenter from './SecurityCenter'
import ThePit from './ThePit'
import Transactions from './Transactions'
import UploadDocuments from './UploadDocuments'
import UploadDocumentsSuccess from './UploadDocuments/Success'
import VerifyEmailToken from './VerifyEmailToken'

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

const SetForegroundProcess = ({ children, imports }) => {
  useEffect(() => {
    imports.setForegroundProcess()
  })

  return <React.Fragment>{children}</React.Fragment>
}

class App extends React.PureComponent {
  render () {
    const {
      imports,
      store,
      history,
      isAuthenticated,
      supportedCoins
    } = this.props

    return (
      <Provider store={store}>
        <TranslationsProvider>
          <ThemeProvider>
            <MediaContextProvider>
              <ConnectedRouter history={history}>
                <SetForegroundProcess imports={imports}>
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
                    <WalletLayout path='/buy-sell' component={BuySell} />
                    <WalletLayout
                      path='/swap/history'
                      component={ExchangeHistory}
                    />
                    <WalletLayout
                      path='/swap/profile'
                      component={ExchangeProfile}
                    />
                    <WalletLayout path='/swap' component={Exchange} exact />
                    <WalletLayout path='/thepit' component={ThePit} />
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
                </SetForegroundProcess>
              </ConnectedRouter>
              <AnalyticsTracker />
              <FontGlobalStyles />
              <IconGlobalStyles />
              <GlobalStyle />
            </MediaContextProvider>
          </ThemeProvider>
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

export default connect(mapStateToProps)(App)
