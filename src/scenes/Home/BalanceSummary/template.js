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
    <div className='container-fluid padding-20 border-box'>
      <div className='row padding-bottom-20'>
        <span className='f-16 em-400 capitalize'>Balances</span>
      </div>
      <div className='row flex-column flex-start flex-center padding-15 border-box border'>
        {props.balances.map(function (balance, index) {
          return (
            <div className='row flex-row flex-between border-bottom padding-vertical-10' key={index}>
              <span className='f-14'>{balance.title}</span>
              {props.bitcoinDisplayed ? (
                <BitcoinDisplay className='f-14' amount={balance.amount} />
              ) : (
                <CurrencyDisplay className='f-14' amount={balance.amount} />
              )}
            </div>
          )
        })}
        <div className='row flex-row flex-between padding-vertical-10'>
          <span className='f-14 em-500 capitalize'>Total</span>
          {props.bitcoinDisplayed ? (
            <BitcoinDisplay className='f-14 em-500 capitalize' amount={props.total} />
          ) : (
            <CurrencyDisplay className='f-14 em-500 capitalize' amount={props.total} />
          )}
        </div>
      </div>
    </div>
  )
}

export default CSSModules(BalanceSummary, style)
