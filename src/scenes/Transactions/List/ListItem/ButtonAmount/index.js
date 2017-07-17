import React from 'react'
import styled from 'styled-components'

import { Button } from 'components/generic/Button'
import CoinDisplay from 'components/shared/CoinDisplay'
import CurrencyDisplay from 'components/shared/CurrencyDisplay'

const ButtonAmount = (props) => {
  let Component
  switch (props.transaction.type) {
    case 'Sent':
      Component = styled(Button)`
        width: 200px;
        background-color: #F26C57;
        &:hover { background-color : #F0573F; }
      `
      break
    case 'Transferred':
      Component = styled(Button)`
        width: 200px;
        background-color: #799EB2;
        &:hover { background-color : #6992A9; }
      `
      break
    default:
      Component = styled(Button)`
        width: 200px;
        background-color: #00BABC;
        &:hover { background-color : #00A1A3; }
      `
  }

  return props.bitcoinDisplayed
    ? <Component onClick={props.clickBitcoinDisplay} fullwidth>
      <CoinDisplay light white>{props.transaction.amount}</CoinDisplay>
    </Component>
    : <Component onClick={props.clickBitcoinDisplay} fullwidth>
      <CurrencyDisplay light white>{props.transaction.amount}</CurrencyDisplay>
    </Component>
}

export default ButtonAmount
