import React from 'react'
import CSSModules from 'react-css-modules'

import BitcoinDisplay from 'components/Shared/BitcoinDisplay'
import CurrencyDisplay from 'components/Shared/CurrencyDisplay'

import style from './style.scss'

const Balance = (props) => {
  return (
    props.bitcoinDisplayed ? (
      <div className='flex-column flex-justify flex-align-end pointer' onClick={props.clickBitcoinDisplay}>
        <BitcoinDisplay className='f-28 half-strong' amount={props.balance} />
        <CurrencyDisplay className='f-24 padding-bottom-10' amount={props.balance} />
      </div>
    ) : (
      <div className='flex-column flex-justify flex-align-end pointer' onClick={props.clickBitcoinDisplay}>
        <CurrencyDisplay className='f-28 half-strong' amount={props.balance} />
        <BitcoinDisplay className='f-24 padding-bottom-10' amount={props.balance} />
      </div>
    )
  )
}

export default CSSModules(Balance, style)
