import React from 'react'
import CSSModules from 'react-css-modules'

import BitcoinDisplay from 'components/Shared/BitcoinDisplay'
import CurrencyDisplay from 'components/Shared/CurrencyDisplay'

import style from './style.scss'

const Balance = (props) => {
  return (
    props.bitcoinDisplayed ? (
      <div className='container-fluid'>
        <div className='row' onClick={props.clickBitcoinDisplay}>
          <div className='col'>
            <BitcoinDisplay className='f-28' amount={props.balance} />
          </div>
        </div>
        <div className='row' onClick={props.clickBitcoinDisplay}>
          <div className='col'>
            <CurrencyDisplay className='f-24' amount={props.balance} />
          </div>
        </div>
      </div>
    ) : (
      <div className='container-fluid'>
        <div className='row' onClick={props.clickBitcoinDisplay}>
          <div className='col'>
            <CurrencyDisplay className='f-28' amount={props.balance} />
          </div>
        </div>
        <div className='row' onClick={props.clickBitcoinDisplay}>
          <div className='col'>
            <BitcoinDisplay className='f-24' amount={props.balance} />
          </div>
        </div>
      </div>
    )
  )
}

export default CSSModules(Balance, style)
