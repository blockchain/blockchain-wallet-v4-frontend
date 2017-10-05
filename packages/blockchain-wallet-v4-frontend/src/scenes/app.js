import React from 'react'
import { Redirect, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import styled from 'styled-components'

import ConnectedIntlProvider from 'providers/ConnectedIntlProvider'
import ThemeProvider from 'providers/ThemeProvider'

import LandingLayout from 'layouts/Landing'
import PublicLayout from 'layouts/Public'
import WalletLayout from 'layouts/Wallet'

import LandingContainer from './Landing'
import LoginContainer from './Login'
import HelpContainer from './Help'
import RecoverContainer from './Recover'
import ReminderContainer from './Reminder'
import Reset2FAContainer from './Reset2FA'
import RegisterContainer from './Register'
import HomeContainer from './Home'
import BitcoinTransactionsContainer from './Transactions/Bitcoin'
import EtherTransactionsContainer from './Transactions/Ether'
import BuyContainer from './Buy'
import ExchangeContainer from './Exchange'
import SecurityCenterContainer from './SecurityCenter'
import InfoContainer from './Info'
import PreferencesContainer from './Preferences'
import SecuritySettingsContainer from './SecuritySettings'
import AddressesContainer from './Addresses'
import FaqContainer from './Faq'

const RootStyle = styled.div`
  font-family: 'Montserrat', sans-serif;
  height: 100%;
`

class App extends React.Component {
  render () {
    const { store, history, messages } = this.props

    return (
      <Provider store={store}>
        <ConnectedIntlProvider messages={messages}>
          <ThemeProvider>
            <RootStyle>
              <ConnectedRouter history={history}>
                <Switch>
                  <LandingLayout exact path='/' component={LandingContainer} />
                  <PublicLayout path='/login' component={LoginContainer} />
                  <PublicLayout path='/help' component={HelpContainer} />
                  <PublicLayout path='/recover' component={RecoverContainer} />
                  <PublicLayout path='/reminder' component={ReminderContainer} />
                  <PublicLayout path='/reset2fa' component={Reset2FAContainer} />
                  <PublicLayout path='/register' component={RegisterContainer} />
                  <WalletLayout path='/wallet' component={HomeContainer} />
                  <WalletLayout path='/transactions/bitcoin' component={BitcoinTransactionsContainer} />
                  <WalletLayout path='/transactions/ether' component={EtherTransactionsContainer} />
                  <WalletLayout path='/buy-sell' component={BuyContainer} />
                  <WalletLayout path='/exchange' component={ExchangeContainer} />
                  <WalletLayout path='/security-center' component={SecurityCenterContainer} />
                  <Redirect from='/settings' to='/settings/info' exact />
                  <WalletLayout path='/settings/info' component={InfoContainer} />
                  <WalletLayout path='/settings/preferences' component={PreferencesContainer} />
                  <WalletLayout path='/settings/security' component={SecuritySettingsContainer} />
                  <WalletLayout path='/settings/addresses' component={AddressesContainer} />
                  <WalletLayout path='/faq' component={FaqContainer} />
                </Switch>
              </ConnectedRouter>
            </RootStyle>
          </ThemeProvider>
        </ConnectedIntlProvider>
      </Provider>
    )
  }
}

export default App
