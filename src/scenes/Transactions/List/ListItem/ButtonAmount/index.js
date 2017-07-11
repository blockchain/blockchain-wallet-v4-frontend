import React from 'react'
import styled from 'styled-components'

import { Button } from 'components/generic/Button'
import BitcoinDisplay from 'components/shared/BitcoinDisplay'
import CurrencyDisplay from 'components/shared/CurrencyDisplay'

const ButtonAmount = (props) => {
  let Component
  switch (props.transaction.type) {
    case 'Sent':
      Component = styled(Button)`background-color: #F26C57; &:hover { background-color : #F0573F; }`
      break
    case 'Transferred':
      Component = styled(Button)`background-color: #799EB2; &:hover { background-color : #6992A9; }`
      break
    default:
      Component = styled(Button)`background-color: #00BABC; &:hover { background-color : #00A1A3; }`
  }

  return props.bitcoinDisplayed
    ? <Component onClick={props.clickBitcoinDisplay} fullwidth><BitcoinDisplay amount={props.transaction.amount} light white /></Component>
    : <Component onClick={props.clickBitcoinDisplay} fullwidth><CurrencyDisplay amount={props.transaction.amount} light white /></Component>
}

export default ButtonAmount
