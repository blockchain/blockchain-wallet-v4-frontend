import React from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'

import HeaderContainer from 'containers/Wallet/Header'
import MenuLeftContainer from 'containers/Wallet/MenuLeft'
import MenuTopContainer from 'containers/Wallet/MenuTop'
import HomeContainer from 'containers/Wallet/Pages/Home'
import TransactionsContainer from 'containers/Wallet/Pages/Transactions'

class WalletContainer extends React.Component {
  render () {
    return (
      <div className='wallet'>
        <div className='row'>
          <HeaderContainer />
        </div>
        <div className='row'>
          <div className='col-md-2'>
            <MenuLeftContainer />
          </div>
          <div className='col-md-10'>
            <div className='row'>
              <MenuTopContainer />
            </div>
            <div className='row'>
              <Router>
                <Switch>
                  <Route exact path='/' component={HomeContainer} />
                  <Route exact path='/transactions' component={TransactionsContainer} />
                </Switch>
              </Router>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default WalletContainer
