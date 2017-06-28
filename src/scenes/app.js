import React from 'react'
import { Redirect, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import { ThemeProvider } from 'styled-components'

import LandingLayout from 'components/Layouts/Landing'
import PublicLayout from 'components/Layouts/Public'
import WalletLayout from 'components/Layouts/Wallet'
import ConnectedIntlProvider from 'components/Shared/ConnectedIntlProvider'

import LandingContainer from './Landing'
import LoginContainer from './Login'
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
import theme from './theme'

class App extends React.Component {
  render () {
    return (
      <Provider store={this.props.store}>
        <ThemeProvider theme={theme}>
          <ConnectedIntlProvider messages={this.props.messages}>
            <ConnectedRouter history={this.props.history}>
              <Switch>
                <LandingLayout exact path='/' component={LandingContainer} />
                <PublicLayout path='/login' component={LoginContainer} />
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
          </ConnectedIntlProvider>
        </ThemeProvider>
      </Provider>
    )
  }
}

export default App
