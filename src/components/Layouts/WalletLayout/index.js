import React from 'react'
import { Route } from 'react-router-dom'
import './style.scss'

import HeaderContainer from 'containers/Shared/Header'
import MenuLeftContainer from 'containers/Shared/MenuLeft'
import MenuTopContainer from 'containers/Shared/MenuTop'

const WalletLayout = ({component: Component, ...rest}) => {
  return (
    <Route {...rest} render={matchProps => (
      <div className='wallet'>
        <div className='wallet-header'>
          <HeaderContainer />
        </div>
        <div className='wallet-content'>
          <div className='wallet-left'>
            <MenuLeftContainer />
          </div>
          <div className='wallet-right'>
            <div className='wallet-top'>
              <MenuTopContainer />
            </div>
            <div className='wallet-page'>
              <Component {...matchProps} />
            </div>
          </div>
        </div>
      </div>
    )} />
  )
}

export default WalletLayout
