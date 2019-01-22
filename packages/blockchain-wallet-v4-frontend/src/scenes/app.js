import React from 'react'
import { Redirect, Switch } from 'react-router-dom'
import { connect, Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { PersistGate } from 'redux-persist/integration/react'
import { IconGlobalStyles, FontGlobalStyles } from 'blockchain-info-components'
import { createGlobalStyle } from 'styled-components'

import { selectors } from 'data'
import { MediaContextProvider } from 'providers/MatchMediaProvider'
import ConnectedIntlProvider from 'providers/ConnectedIntlProvider'
import ThemeProvider from 'providers/ThemeProvider'
import PublicLayout from 'layouts/Public'
import WalletLayout from 'layouts/Wallet'
import AuthorizeLogin from './AuthorizeLogin'
import BuySell from './BuySell'
import Exchange from './Exchange'
import ExchangeHistory from './ExchangeHistory'
import ExchangeProfile from './ExchangeProfile'
import Help from './Help'
import Home from './Home'
import Lockbox from './Lockbox'
import Login from './Login'
import Logout from './Logout'
import Recover from './Recover'
import Reminder from './Reminder'
import Reset2FA from './Reset2FA'
import Reset2FAToken from './Reset2FAToken'
import UploadDocuments from './UploadDocuments'
import UploadDocumentsSuccess from './UploadDocuments/Success'
import VerifyEmailToken from './VerifyEmailToken'
import Register from './Register'
import SecurityCenter from './SecurityCenter'
import Addresses from './Settings/Addresses'
import General from './Settings/General'
import Profile from './Settings/Profile'
import Preferences from './Settings/Preferences'
import Transactions from './Transactions'

const GlobalStyle = createGlobalStyle`
  html, body, #app, #app > div {padding: 0; margin: 0; height: 100%;}
  html, body {overflow: hidden;}
`

class App extends React.PureComponent {
  render () {
    const { store, history, messages, persistor, isAuthenticated } = this.props
    return (
      <Provider store={store}>
        <ConnectedIntlProvider messages={messages}>
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
                      path='/btc/transactions'
                      component={Transactions}
                      coin='BTC'
                    />
                    <WalletLayout
                      path='/eth/transactions'
                      component={Transactions}
                      coin='ETH'
                    />
                    <WalletLayout
                      path='/bch/transactions'
                      component={Transactions}
                      coin='BCH'
                    />
                    <WalletLayout
                      path='/xlm/transactions'
                      component={Transactions}
                      coin='XLM'
                    />
                    <WalletLayout
                      path='/swap/history'
                      component={ExchangeHistory}
                    />
                    <WalletLayout
                      path='/swap/profile'
                      component={ExchangeProfile}
                    />
                    <WalletLayout path='/swap' component={Exchange} exact />
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
                    {isAuthenticated ? (
                      <Redirect from='/' to='/home' />
                    ) : (
                      <Redirect from='/' to='/login' />
                    )}
                  </Switch>
                </ConnectedRouter>
                <FontGlobalStyles />
                <IconGlobalStyles />
                <GlobalStyle />
              </MediaContextProvider>
            </ThemeProvider>
          </PersistGate>
        </ConnectedIntlProvider>
      </Provider>
    )
  }
}

const mapStateToProps = state => ({
  isAuthenticated: selectors.auth.isAuthenticated(state)
})

export default connect(mapStateToProps)(App)
