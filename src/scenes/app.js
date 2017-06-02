import React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'

import LandingLayout from 'components/Layouts/Landing'
import PublicLayout from 'components/Layouts/Public'
import WalletLayout from 'components/Layouts/Wallet'

import LandingContainer from './Landing'
import LoginContainer from './Login'
import RegisterContainer from './Register'
import HomeContainer from './Home'
import TransactionsContainer from './Transactions'
import BuyContainer from './Buy'
import SecurityContainer from './Security'
import SettingsContainer from './Settings'
import FaqContainer from './Faq'

import { Provider } from 'react-redux'

class App extends React.Component {
  render () {
    return (
      <Provider store={this.props.store}>
        <Router>
          <Switch>
            <LandingLayout exact path='/' component={LandingContainer} />
            <PublicLayout path='/login' component={LoginContainer} />
            <PublicLayout path='/register' component={RegisterContainer} />
            <WalletLayout path='/wallet' component={HomeContainer} />
            <WalletLayout path='/transactions' component={TransactionsContainer} />
            <WalletLayout path='/buy-sell' component={BuyContainer} />
            <WalletLayout path='/security-center' component={SecurityContainer} />
            <WalletLayout path='/settings' component={SettingsContainer} />
            <WalletLayout path='/faq' component={FaqContainer} />
          </Switch>
        </Router>
      </Provider>
    )
  }
}

export default App
