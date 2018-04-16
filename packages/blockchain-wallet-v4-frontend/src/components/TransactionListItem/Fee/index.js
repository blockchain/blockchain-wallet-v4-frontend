import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import CoinDisplay from 'components/Display/CoinDisplay'
import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  width: 100%;
  > *:first-child {
    margin-right: 3px;
  }
`

const Fee = props => (
  <Wrapper>
    <Text size='12px' weight={300}>
      <FormattedMessage id='scenes.transactions.bitcoin.content.pages.listitem.fee.label' defaultMessage='Transaction fee: {value}' values={{ value: props.amount }} />
    </Text>
    <CoinDisplay coin={props.coin} size='12px' weight={200}>{props.fee}</CoinDisplay>
  </Wrapper>
)

Fee.propTypes = {
  fee: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  coin: PropTypes.string.isRequired
}

export default Fee
