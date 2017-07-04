import React from 'react'
import { FormattedMessage } from 'react-intl'
import { NavLink } from 'react-router-dom'

import { Button } from 'components/Shared/Button'

const Main = (props) => {
  return (
    <section>
      <div className='container h-100'>
        <div className='row h-25 justify-content-center align-items-center'>
          <div className='col-auto'>
            <div>
              <FormattedMessage id='scenes.landing.main.mostpopular' defaultMessage="The world's most popular bitcoin wallet" />
            </div>
          </div>
        </div>
        <div className='row h-25 justify-content-around align-items-center hidden-sm-down'>
          <div className='col-12 col-md-3'>
            <div className='row h-50 justify-content-around'>
              <div className='col-auto'>
                <div>
                  <FormattedMessage id='scenes.landing.main.transactionsamount' defaultMessage='{nbTransactions} Million+' values={{nbTransactions: 100}} />
                </div>
              </div>
            </div>
            <div className='row h-50 justify-content-center'>
              <div className='col-auto'>
                <div>
                  <FormattedMessage id='scenes.landing.main.transactions' defaultMessage='Transactions' />
                </div>
              </div>
            </div>
          </div>
          <div className='col col-md-3'>
            <div className='row h-50 justify-content-center'>
              <div className='col-auto'>
                <div>
                  <FormattedMessage id='scenes.landing.main.walletsamount' defaultMessage='{nbWallets} Million+' values={{nbWallets: 14}} />
                </div>
              </div>
            </div>
            <div className='row justify-content-center'>
              <div className='col-auto'>
                <div>
                  <FormattedMessage id='scenes.landing.main.wallets' defaultMessage='Wallets' />
                </div>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-3'>
            <div className='row h-50 justify-content-center'>
              <div className='col-auto'>
                <div>
                  <FormattedMessage id='scenes.landing.main.countriesamount' defaultMessage='{nbCountries}+' values={{nbCountries: 140}} />
                </div>
              </div>
            </div>
            <div className='row h-50 justify-content-center'>
              <div className='col-auto'>
                <div>
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
                <NavLink to='/login'>
                  <Button type='primary' weight={1000} transform='uppercase' fullwidth>
                    <FormattedMessage id='scenes.landing.main.register' defaultMessage='Create your wallet' />
                  </Button>
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
                  <Button type='secondary' weight={1000} transform='uppercase' fullwidth>
                    <FormattedMessage id='scenes.landing.main.login' defaultMessage='Login now' />
                  </Button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Main
