import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import CoinDisplay from 'components/Display/CoinDisplay'
import { Text, Tooltip } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  padding: 5px 0;

  @media(min-width: 1200px) {
    justify-content: flex-end;
    padding: 0;
  }
`

const Fee = props => (
  <Wrapper>
    <Tooltip>
      <FormattedMessage id='scenes.transactions.bitcoin.content.pages.listitem.fee.tooltip1' defaultMessage='Bitcoin miners receive fees for verifying transactions.' />
      <FormattedMessage id='scenes.transactions.bitcoin.content.pages.listitem.fee.tooltip2' defaultMessage='We set fees dynamically based on network conditions and transaction size.' />
      <FormattedMessage id='scenes.transactions.bitcoin.content.pages.listitem.fee.tooltip3' defaultMessage='You can customize your fee in advanced send.' />
    </Tooltip>
    <Text size='13px' weight={300}>
      <FormattedMessage id='scenes.transactions.bitcoin.content.pages.listitem.fee.label' defaultMessage='Transaction Fee: {value}' values={{ value: props.amount }} />
    </Text>
    <CoinDisplay coin='BTC' size='13px' weight={500}>{props.fee}</CoinDisplay>
  </Wrapper>
)

Fee.propTypes = {
  fee: PropTypes.number.isRequired
}

export default Fee
