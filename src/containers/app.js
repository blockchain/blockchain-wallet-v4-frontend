import React from 'react'
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'

import HeaderContainer from './Header'
import HomeContainer from './Home'
import TransactionsContainer from './Transactions'
import MenuLeft from 'components/Shared/MenuLeft'
import MenuTop from 'components/Shared/MenuTop'

class App extends React.Component {
  render () {
    return (
      <Router>
        <div className='app'>
          <div className='container'>
            <div className='row'>
              <HeaderContainer />
            </div>
            <div className='row'>
              <div className='col-md-2'>
                <MenuLeft />
              </div>
              <div className='col-md-10'>
                <div className='row'>
                  <MenuTop />
                </div>
                <div className='row'>
                  <Switch>
                    <Route exact path='/' component={HomeContainer} />
                    <Route exact path='/transactions' component={TransactionsContainer} />
                  </Switch>
                </div>
              </div>
            </div>
          </div>

          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/transactions'>Transactions</Link></li>
          </ul>
        </div>
      </Router>
    )
  }
}

export default App
