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

const Fee = props => (
  <Wrapper>
    <Text size='12px' weight={300}>
      <FormattedMessage id='scenes.transactions.bitcoin.content.pages.listitem.fee.label' defaultMessage='Transaction fee: {value}' values={{ value: props.amount }} />
    </Text>
    <CoinDisplay coin={props.coin} size='12px' weight={200}>{props.fee}</CoinDisplay>
  </Wrapper>
)

Fee.propTypes = {
  fee: PropTypes.number.isRequired,
  coin: PropTypes.string.isRequired
}

export default Fee
