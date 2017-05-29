import React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'

import WalletLayout from 'components/Layouts/WalletLayout'
import PublicLayout from 'components/Layouts/PublicLayout'
import LandingContainer from 'containers/Landing'
import LoginContainer from 'containers/Login'
import RegisterContainer from 'containers/Register'
import HomeContainer from 'containers/Home'
import TransactionsContainer from 'containers/Transactions'

import { Provider } from 'react-redux'

class App extends React.Component {
  render () {
    return (
      <Provider store={this.props.store}>
        <Router>
          <Switch>
            <WalletLayout path='/home' component={HomeContainer} />
            <WalletLayout path='/transactions' component={TransactionsContainer} />
            <PublicLayout path='/landing' component={LandingContainer} />
            <PublicLayout path='/login' component={LoginContainer} />
            <PublicLayout path='/register' component={RegisterContainer} />
          </Switch>
        </Router>
      </Provider>
    )
  }
}

export default App
