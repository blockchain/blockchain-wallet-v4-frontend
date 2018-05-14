import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { any, equals, filter } from 'ramda'

import { Text, TextGroup, Tooltip } from 'blockchain-info-components'
import { utils } from 'blockchain-wallet-v4/src'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

const hasLabel = (io) => io.label
const notChange = (io) => !io.change

const Addresses = props => {
  const { from, to, outputs, inputs, coin } = props

  return (
    <Wrapper>
      <TextGroup inline>
        <Text size='13px' weight={500}>
          <FormattedMessage id='components.transactionlistitem.addresses.to' defaultMessage='To: ' />
        </Text>
        <Tooltip width='auto' label={to} hover={outputs && any(hasLabel, filter(notChange, outputs))}>
          { outputs && filter(hasLabel, filter(notChange, outputs)).map((output, index) =>
            <Text key={index} size='12px' weight={300}>
              {equals(coin, 'BCH') ? utils.bch.toCashAddr(output.address, true) : output.address}
            </Text>)
          }
        </Tooltip>
      </TextGroup>
      <TextGroup inline>
        <Text size='13px' weight={500}>
          <FormattedMessage id='components.transactionlistitem.addresses.from' defaultMessage='From: ' />
        </Text>
        <Tooltip width='auto' label={from} hover={inputs && inputs.some(hasLabel)}>
          { inputs && inputs.map((input, index) => input.label &&
            <Text key={index} size='12px' weight={300}>
              {equals(coin, 'BCH') ? utils.bch.toCashAddr(input.address, true) : input.address}
            </Text>)
          }
        </Tooltip>
      </TextGroup>
    </Wrapper>
  )
}

Addresses.propTypes = {
  to: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired
}

export default Addresses
