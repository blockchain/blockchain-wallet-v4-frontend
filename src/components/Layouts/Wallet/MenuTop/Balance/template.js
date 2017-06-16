import React from 'react'
import CSSModules from 'react-css-modules'

import BitcoinDisplay from 'components/Shared/BitcoinDisplay'
import CurrencyDisplay from 'components/Shared/CurrencyDisplay'

import style from './style.scss'

const Balance = (props) => {
  return (
    props.bitcoinDisplayed ? (
      <div styleName='balance'>
        <div className='row justify-content-start justify-content-md-end' onClick={props.clickBitcoinDisplay}>
          <div className='col-12 col-md-4'>
            <BitcoinDisplay className='f-28' amount={props.balance} />
          </div>
        </div>
        <div className='row justify-content-start justify-content-md-end' onClick={props.clickBitcoinDisplay}>
          <div className='col-12 col-md-4'>
            <CurrencyDisplay className='f-24' amount={props.balance} />
          </div>
        </div>
      </div>
    ) : (
      <div styleName='balance'>
        <div className='row justify-content-start justify-content-md-end' onClick={props.clickBitcoinDisplay}>
          <div className='col-12 col-md-4'>
            <CurrencyDisplay className='f-28' amount={props.balance} />
          </div>
        </div>
        <div className='row justify-content-start justify-content-md-end' onClick={props.clickBitcoinDisplay}>
          <div className='col-12 col-md-4'>
            <BitcoinDisplay className='f-24' amount={props.balance} />
          </div>
        </div>
      </div>
    )
  )
}

export default CSSModules(Balance, style)
