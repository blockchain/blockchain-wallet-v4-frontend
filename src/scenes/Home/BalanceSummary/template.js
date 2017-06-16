/**
 * Created by Lyncee on 08/06/2017.
 */
import React from 'react'
import CSSModules from 'react-css-modules'

import BitcoinDisplay from 'components/Shared/BitcoinDisplay'
import CurrencyDisplay from 'components/Shared/CurrencyDisplay'

import style from './style.scss'

const BalanceSummary = (props) => {
  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col'>
          <span className='text-capitalize'>Balances</span>
        </div>
      </div>
      <div className='row padding-top-20'>
        <div className='col padding-20 border'>
          {props.balances.map(function (balance, index) {
            return (
              <div className='row justify-content-between padding-vertical-10 border-bottom' key={index}>
                <div className='col-6'>
                  <span className='f-14'>{balance.title}</span>
                </div>
                <div className='col-6 right-align'>
                  {props.bitcoinDisplayed ? (
                    <BitcoinDisplay className='f-14' amount={balance.amount} />
                  ) : (
                    <CurrencyDisplay className='f-14' amount={balance.amount} />
                  )}
                </div>
              </div>
            )
          })}
          <div className='row justify-content-between padding-vertical-10'>
            <div className='col-6'>
              <span className='f-14 text-capitalize'>Total</span>
            </div>
            <div className='col-6 right-align'>
              {props.bitcoinDisplayed ? (
                <BitcoinDisplay className='f-14' amount={props.total} />
              ) : (
                <CurrencyDisplay className='f-14' amount={props.total} />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CSSModules(BalanceSummary, style)
