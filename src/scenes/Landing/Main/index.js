import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import Translate from 'components/Shared/Translate'
import style from './style.scss'

const Main = (props) => {
  let transactions = '100'
  let wallets = '14'

  return (
    <section styleName='main'>
      <div className='container h-100'>
        <div className='row h-25 justify-content-center align-items-center'>
          <div className='col-auto'>
            <Translate styleName='title' translate='MOST_POPULAR_WALLET' />
          </div>
        </div>
        <div className='row h-25 justify-content-around align-items-center hidden-sm-down'>
          <div className='col-12 col-md-3'>
            <div className='row h-50 justify-content-around'>
              <div className='col-auto'>
                <Translate styleName='statistic' translate='TRANSACTIONS_AMT' data={{ '{{count}}': transactions }} />
              </div>
            </div>
            <div className='row h-50 justify-content-center'>
              <div className='col-auto'>
                <Translate styleName='statistic-info' translate='TRANSACTIONS' />
              </div>
            </div>
          </div>
          <div className='col col-md-3'>
            <div className='row h-50 justify-content-center'>
              <div className='col-auto'>
                <Translate styleName='statistic' translate='WALLETS_AMT' data={{ '{{count}}': wallets }} />
              </div>
            </div>
            <div className='row justify-content-center'>
              <div className='col-auto'>
                <Translate styleName='statistic-info' translate='WALLETS' />
              </div>
            </div>
          </div>
          <div className='col-12 col-md-3'>
            <div className='row h-50 justify-content-center'>
              <div className='col-auto'>
                <Translate styleName='statistic' translate='COUNTRIES_SERVED_AMT' />
              </div>
            </div>
            <div className='row h-50 justify-content-center'>
              <div className='col-auto'>
                <Translate styleName='statistic-info' translate='COUNTRIES_SERVED' />
              </div>
            </div>
          </div>
        </div>
        <div className='row h-25 justify-content-center align-items-center'>
          <div className='col-12'>
            <div className='row justify-content-center'>
              <div className='col-12 col-sm-8 col-md-6 col-lg-4'>
                <NavLink to='/register'>
                  <button className='button-primary full-width heavy'>Create your wallet</button>
                </NavLink>
              </div>
            </div>
            <div className='row justify-content-center center-align'>
              <div className='col-12 col-sm-8 col-md-6 col-lg-4'>
                <span className='f-20 white'>or</span>
              </div>
            </div>
            <div className='row justify-content-center'>
              <div className='col-12 col-sm-8 col-md-6 col-lg-4'>
                <NavLink to='/login'>
                  <button className='button-secondary full-width heavy'>Login</button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

Main.propTypes = {
  amount_transaction: PropTypes.number.isRequired,
  amount_wallets: PropTypes.number.isRequired
}

export default CSSModules(Main, style)
