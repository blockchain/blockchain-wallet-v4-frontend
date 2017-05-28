import React from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'

import WalletContainer from 'containers/Wallet'
import LandingContainer from 'containers/Landing'
import LoginContainer from 'containers/Login'
import RegisterContainer from 'containers/Register'

import { Provider } from 'react-redux'

class App extends React.Component {
  render () {
    return (
      <Provider store={this.props.store}>
        <Router>
          <Switch>
            <Route exact path='/' component={WalletContainer} />
            <Route exact path='/landing' component={LandingContainer} />
            <Route exact path='/login' component={LoginContainer} />
            <Route exact path='/register' component={RegisterContainer} />
          </Switch>
          {/*<ul>*/}
            {/*<li><Link to='/'>Wallet</Link></li>*/}
            {/*<li><Link to='/landing'>Landing</Link></li>*/}
            {/*<li><Link to='/login'>Login</Link></li>*/}
            {/*<li><Link to='/register'>Register</Link></li>*/}
          {/*</ul>*/}
        </Router>
      </Provider>
    )
  }
}

export default App
