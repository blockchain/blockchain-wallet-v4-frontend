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
        <HeaderContainer />
        <div className='row'>
          <div className='col-md-2'>
            <MenuLeftContainer />
          </div>
          <div className='col-md-10'>
            <div className='row'>
              <MenuTopContainer />
            </div>
            <div className='row'>
              <Component {...matchProps} />
            </div>
          </div>
        </div>
      </div>
    )} />
  )
}

export default WalletLayout
