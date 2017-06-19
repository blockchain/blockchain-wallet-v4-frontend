import React from 'react'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'

import BitcoinDisplay from 'components/Shared/BitcoinDisplay'
import CurrencyDisplay from 'components/Shared/CurrencyDisplay'

import style from './style.scss'

const Balance = (props) => {
  return (
    props.bitcoinDisplayed ? (
      <div styleName='balance'>
        <div className='row justify-content-start justify-content-md-end' onClick={props.clickBitcoinDisplay}>
          <div className='col-auto'>
            <BitcoinDisplay className='f-28' amount={props.balance} />
          </div>
        </div>
        <div className='row justify-content-start justify-content-md-end' onClick={props.clickBitcoinDisplay}>
          <div className='col-auto'>
            <CurrencyDisplay className='f-24' amount={props.balance} />
          </div>
        </div>
      </div>
    ) : (
      <div styleName='balance'>
        <div className='row justify-content-start justify-content-md-end' onClick={props.clickBitcoinDisplay}>
          <div className='col-auto'>
            <CurrencyDisplay className='f-28' amount={props.balance} />
          </div>
        </div>
        <div className='row justify-content-start justify-content-md-end' onClick={props.clickBitcoinDisplay}>
          <div className='col-auto'>
            <BitcoinDisplay className='f-24' amount={props.balance} />
          </div>
        </div>
      </div>
    )
  )
}

Balance.defaultProps = {
  balance: 0
}

Balance.propTypes = {
  balance: PropTypes.number.isRequired,
  clickBitcoinDisplay: PropTypes.func.isRequired
}

export default CSSModules(Balance, style)
