import React from 'react'
import { Redirect, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
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
import Goals from './Goals'
import Help from './Help'
import Home from './Home'
import Lockbox from './Lockbox'
import LockboxDashboard from './Lockbox/Dashboard'
import LockboxOnboard from './Lockbox/Onboard'
import Login from './Login'
import Logout from './Logout'
import Recover from './Recover'
import Reminder from './Reminder'
import Reset2FA from './Reset2FA'
import Reset2FAToken from './Reset2FAToken'
import VerifyEmailToken from './VerifyEmailToken'
import Register from './Register'
import SecurityCenter from './SecurityCenter'
import Addresses from './Settings/Addresses/Btc'
import BchAddresses from './Settings/Addresses/Bch'
import BtcManageAddresses from './Settings/Addresses/Btc/ManageAddresses'
import Info from './Settings/Info'
import Profile from './Settings/Profile'
import Preferences from './Settings/Preferences'
import BitcoinTransactions from './Transactions/Btc'
import EtherTransactions from './Transactions/Eth'
import BchTransactions from './Transactions/Bch'

class App extends React.PureComponent {
  render () {
    const { store, history, messages } = this.props
    const userFlowSupported = selectors.modules.profile
      .userFlowSupported(store.getState())
      .getOrElse(false)
    return (
      <Provider store={store}>
        <ConnectedIntlProvider messages={messages}>
          <ThemeProvider>
            <MediaContextProvider>
              <ConnectedRouter history={history}>
                <Switch>
                  <PublicLayout path='/open/:payload' component={Goals} />
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
                  <PublicLayout path='/wallet' component={Login} />
                  <WalletLayout path='/home' component={Home} />
                  <WalletLayout
                    path='/btc/transactions'
                    component={BitcoinTransactions}
                  />
                  <WalletLayout
                    path='/eth/transactions'
                    component={EtherTransactions}
                  />
                  <WalletLayout path='/buy-sell' component={BuySell} />
                  <WalletLayout
                    path='/bch/transactions'
                    component={BchTransactions}
                  />
                  <WalletLayout
                    path='/exchange/history'
                    component={ExchangeHistory}
                  />
                  <WalletLayout path='/exchange' component={Exchange} exact />
                  <WalletLayout
                    path='/security-center'
                    component={SecurityCenter}
                  />
                  {userFlowSupported && (
                    <WalletLayout
                      path='/settings/profile'
                      component={Profile}
                    />
                  )}
                  <WalletLayout
                    path='/settings/preferences'
                    component={Preferences}
                  />
                  <WalletLayout
                    path='/settings/addresses/btc/:index'
                    component={BtcManageAddresses}
                  />
                  <WalletLayout
                    path='/settings/addresses'
                    component={Addresses}
                    exact
                  />
                  <WalletLayout
                    path='/settings/addresses/bch'
                    component={BchAddresses}
                  />
                  <WalletLayout path='/settings/info' component={Info} />
                  <WalletLayout path='/lockbox' component={Lockbox} exact />
                  <WalletLayout
                    path='/lockbox/dashboard'
                    component={LockboxDashboard}
                    exact
                  />
                  <WalletLayout
                    path='/lockbox/onboard'
                    component={LockboxOnboard}
                    exact
                  />
                  <WalletLayout
                    path='/lockbox/settings'
                    component={LockboxDashboard}
                    exact
                  />
                  <Redirect from='/' to='/login' />
                </Switch>
              </ConnectedRouter>
            </MediaContextProvider>
          </ThemeProvider>
        </ConnectedIntlProvider>
      </Provider>
    )
  }
}

export default App
