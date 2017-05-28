import React from 'react'
import './style.scss'

import HeaderContainer from 'containers/Wallet/Header'
import MenuLeftContainer from 'containers/Wallet/MenuLeft'
import MenuTopContainer from 'containers/Wallet/MenuTop'
import HomeContainer from 'containers/Wallet/Home'
import TransactionsContainer from 'containers/Wallet/Transactions'

const MenuLeft = () => {
  return (
    <div className='wallet'>
      <HeaderContainer />
      <div className='container'>
        <div className='row'>
          <div className='col-md-2'>
            <MenuLeftContainer />
          </div>
          <div className='col-md-10'>
            <div className='row'>
              <MenuTopContainer />
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
    </div>
  )
}

export default MenuLeft
