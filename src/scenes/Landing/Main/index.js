import React from 'react'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Main = () => {
  return (
    <section styleName='main'>
      <div className='container valign-center'>
        <div className='row align-center padding-25'>
          <span className='f-52'>The World's Most Popular Bitcoin Wallet</span>
        </div>
        <div className='row padding-25'>
          <div className='col-md-4 valign-center'>
            <span className='x-large'>100 Million+</span>
            <span className='light'>Transactions</span>
          </div>
          <div className='col-md-4 valign-center'>
            <span className='x-large'>13 Million+</span>
            <span className='light'>Wallets</span>
          </div>
          <div className='col-md-4 valign-center'>
            <span className='x-large'>140+</span>
            <span className='light'>Countries Served</span>
          </div>
        </div>
        <div className='row padding-25'>
          <div className='col-md-4 col-md-offset-4 valign-center'>
            <NavLink className='primary' to='/register'>
              <button className='primary'>Create your wallet</button>
            </NavLink>
            <span>or</span>
            <NavLink to='/login'>
              <button className='secondary'>Login</button>
            </NavLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CSSModules(Main, style)
