import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import CoinDisplay from 'components/Display/CoinDisplay'
import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  // padding: 5px 0;

  // @media(min-width: 1200px) {
  //   justify-content: flex-end;
  //   padding: 0;
  // }
`

const Label = styled(Text)`

`

const Value = styled(CoinDisplay)`

`

const Fee = props => (
  <Wrapper>
    <Label size='12px' weight={300}>
      <FormattedMessage id='scenes.transactions.bitcoin.content.pages.listitem.fee.label' defaultMessage='Transaction Fee: {value}' values={{ value: props.amount }} />
    </Label>
    <Value coin='BTC' size='12px' weight={200}>{props.fee}</Value>
  </Wrapper>
)

Fee.propTypes = {
  fee: PropTypes.number.isRequired
}

export default Fee
