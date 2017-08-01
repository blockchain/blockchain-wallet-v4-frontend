import React from 'react'
import { Redirect, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import styled, { ThemeProvider } from 'styled-components'


import LandingLayout from 'components/layouts/Landing'
import PublicLayout from 'components/layouts/Public'
import WalletLayout from 'components/layouts/Wallet'
import ConnectedIntlProvider from 'components/providers/ConnectedIntlProvider'
import LandingContainer from './Landing'
import LoginContainer from './Login'
import HelpContainer from './Help'
import RecoverContainer from './Recover'
import ReminderContainer from './Reminder'
import Reset2FAContainer from './Reset2FA'
import RegisterContainer from './Register'
import HomeContainer from './Home'
import TransactionsContainer from './Transactions'
import BuyContainer from './Buy'
import SecurityCenterContainer from './SecurityCenter'
import InfoContainer from './Info'
import PreferencesContainer from './Preferences'
import SecuritySettingsContainer from './SecuritySettings'
import AddressesContainer from './Addresses'
import FaqContainer from './Faq'

const RootStyle = styled.div`
  font-family: 'Montserrat', 'Helvetica', sans-serif !important;
  height: 100%;
`


class App extends React.Component {
  render () {
    const { store, history, messages, theme } = this.props

    return (
      <Provider store={store}>
        <ConnectedIntlProvider messages={messages}>
          <ThemeProvider theme={theme}>
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
                  <WalletLayout path='/transactions' component={TransactionsContainer} />
                  <WalletLayout path='/buy-sell' component={BuyContainer} />
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
