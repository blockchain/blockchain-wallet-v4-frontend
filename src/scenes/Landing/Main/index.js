import React from 'react'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Main = () => {
  return (
    <section styleName='main'>
      <div className='container h-100'>
        <div className='row h-25 justify-content-center align-items-center'>
          <div className='col center-align'>
            <span className='f-52 white'>The World's Most Popular Bitcoin Wallet</span>
          </div>
        </div>
        <div className='row h-25 justify-content-around align-items-center'>
          <div className='col col-md-3'>
            <div className='row justify-content-center'>
              <div className='col center-align'>
                <span className='f-32 white'>100 Million+</span>
              </div>
            </div>
             <div className='row justify-content-center'>
              <div className='col center-align'>
                <span className='f-20 white'>Transactions</span>
              </div>
            </div>
          </div>
          <div className='col col-md-3'>
            <div className='row justify-content-center'>
              <div className='col center-align'>
                <span className='f-32 white'>13 Million+</span>
              </div>
            </div>
             <div className='row justify-content-center'>
              <div className='col center-align'>
               <span className='f-20 white'>Wallets</span>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-3'>
            <div className='row justify-content-center'>
              <div className='col center-align'>
                <span className='f-32 white'>140+</span>
              </div>
            </div>
             <div className='row justify-content-center'>
              <div className='col center-align'>
                <span className='f-20 white'>Countries Served</span>
              </div>
            </div>
          </div>
        </div>
        <div className='row h-25 justify-content-center align-items-center'>
          <div className='col'>
            <div className='row justify-content-center'>
              <div className='col-3 center-align'>
                <NavLink to='/register'>
                  <button className='button-primary full-width heavy'>Create your wallet</button>
                </NavLink>
              </div>
            </div>
            <div className='row justify-content-center'>
              <div className='col-3 center-align'>
                <span className='f-20 white'>or</span>
              </div>
            </div>
            <div className='row justify-content-center'>
              <div className='col-3 center-align'>
                <NavLink to='/login'>
                  <button className='button-purple full-width heavy'>Login</button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
        </div>
    </section>
  )
}

export default CSSModules(Main, style)
