import React from 'react'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Main = () => {
  return (
    <section styleName='main'>
      <div className='container flex-column flex-justify flex-center'>
        <div className='row flex-row flex-justify flex-center'>
          <span className='f-52 half-strong white'>The World's Most Popular Bitcoin Wallet</span>
        </div>
        <div className='row margin-60 hidden-xs'>
          <div className='col-md-4 flex-column flex-justify flex-center'>
            <span className='f-32 half-strong white'>100 Million+</span>
            <span className='f-20 white'>Transactions</span>
          </div>
          <div className='col-md-4 flex-column flex-justify flex-center'>
            <span className='f-32 half-strong white'>13 Million+</span>
            <span className='f-20 white'>Wallets</span>
          </div>
          <div className='col-md-4 flex-column flex-justify flex-center'>
            <span className='f-32 half-strong white'>140+</span>
            <span className='f-20 white'>Countries Served</span>
          </div>
        </div>
        <div className='row margin-60'>
          <div className='col-md-4 col-md-offset-4 flex-column flex-justify flex-center'>
            <NavLink to='/register' className='button-primary full-width heavy'>Create your wallet</NavLink>
            <span className='f-20 padding-10 white'>or</span>
            <NavLink to='/login' className='button-purple full-width heavy'>Login</NavLink>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CSSModules(Main, style)
