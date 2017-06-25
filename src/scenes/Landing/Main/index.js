import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import style from './style.scss'

const Main = (props) => {
  return (
    <section styleName='main'>
      <div className='container h-100'>
        <div className='row h-25 justify-content-center align-items-center'>
          <div className='col-auto'>
            <div styleName='title'>
              <FormattedMessage id='scenes.landing.main.mostpopular' defaultMessage="The world's most popular bitcoin wallet" />
            </div>
          </div>
        </div>
        <div className='row h-25 justify-content-around align-items-center hidden-sm-down'>
          <div className='col-12 col-md-3'>
            <div className='row h-50 justify-content-around'>
              <div className='col-auto'>
                <div styleName='statistic'>
                  <FormattedMessage id='scenes.landing.main.transactionsamount' defaultMessage='{nbTransactions} Million+' values={{nbTransactions: 100}} />
                </div>
              </div>
            </div>
            <div className='row h-50 justify-content-center'>
              <div className='col-auto'>
                <div styleName='statistic-info'>
                  <FormattedMessage id='scenes.landing.main.transactions' defaultMessage='Transactions' />
                </div>
              </div>
            </div>
          </div>
          <div className='col col-md-3'>
            <div className='row h-50 justify-content-center'>
              <div className='col-auto'>
                <div styleName='statistic'>
                  <FormattedMessage id='scenes.landing.main.walletsamount' defaultMessage='{nbWallets} Million+' values={{nbWallets: 14}} />
                </div>
              </div>
            </div>
            <div className='row justify-content-center'>
              <div className='col-auto' styleName='statistic-info'>
                <div styleName='statistic-info'>
                  <FormattedMessage id='scenes.landing.main.wallets' defaultMessage='Wallets' />
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-3'>
            <div className='row h-50 justify-content-center'>
              <div className='col-auto'>
                <div styleName='statistic'>
                  <FormattedMessage id='scenes.landing.main.countriesamount' defaultMessage='{nbCountries}+' values={{nbCountries: 140}} />
                </div>
              </div>
            </div>
            <div className='row h-50 justify-content-center'>
              <div className='col-auto'>
                <div styleName='statistic-info'>
                  <FormattedMessage id='scenes.landing.main.countries' defaultMessage='Countries served' />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='row h-25 justify-content-center align-items-center'>
          <div className='col-12'>
            <div className='row justify-content-center'>
              <div className='col-12 col-sm-8 col-md-6 col-lg-4'>
                <NavLink to='/register'>
                  <button className='button-primary full-width heavy'>
                    <FormattedMessage id='scenes.landing.main.register' defaultMessage='Create your wallet' />
                  </button>
                </NavLink>
              </div>
            </div>
            <div className='row justify-content-center center-align'>
              <div className='col-12 col-sm-8 col-md-6 col-lg-4'>
                <FormattedMessage id='scenes.landing.main.or' defaultMessage='or' />
              </div>
            </div>
            <div className='row justify-content-center'>
              <div className='col-12 col-sm-8 col-md-6 col-lg-4'>
                <NavLink to='/login'>
                  <button className='button-secondary full-width heavy'>
                    <FormattedMessage id='scenes.landing.main.login' defaultMessage='Login now' />
                  </button>
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
