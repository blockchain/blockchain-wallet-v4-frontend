import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import CSSModules from 'react-css-modules'

import BitcoinDisplay from 'components/Shared/BitcoinDisplay'
import CurrencyDisplay from 'components/Shared/CurrencyDisplay'

import style from './style.scss'

const BalanceSummary = (props) => {
  return (
    <div className='container-fluid padding-bottom-30' styleName='balance-summary'>
      <div className='row padding-bottom-20'>
        <div className='col-auto h6 text-capitalize'>
          <FormattedMessage id='scenes.home.balancesummary.title' defaultMessage='Balance summary' />
        </div>
      </div>
      <div className='row'>
        <div className='col-12 border'>
          {props.balances.map(function (balance, index) {
            return (
              <div className='row justify-content-between margin-0 padding-vertical-10 border-bottom' key={index}>
                <div className='col-auto'>
                  <span>{balance.title}</span>
                </div>
                <div className='col-auto'>
                  {props.bitcoinDisplayed ? (
                    <BitcoinDisplay amount={balance.amount} />
                  ) : (
                    <CurrencyDisplay amount={balance.amount} />
                  )}
                </div>
              </div>
            )
          })}
          <div className='row justify-content-between margin-0 padding-vertical-10'>
            <div className='col-auto'>
              <span className='font-weight-bold text-capitalize'>Total</span>
            </div>
            <div className='col-auto'>
              {props.bitcoinDisplayed ? (
                <BitcoinDisplay className='font-weight-bold' amount={props.total} />
              ) : (
                <CurrencyDisplay className='font-weight-bold' amount={props.total} />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

BalanceSummary.propTypes = {
  balances: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      amount: PropTypes.number
    })
  ),
  total: PropTypes.number.isRequired
}

export default CSSModules(BalanceSummary, style)
