import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

// TODO: use formatted messages!
const Addresses = props => (
  <Wrapper>
    <TextGroup inline>
      <Text size='13px' weight={500}>To: </Text>
      <Text size='13px' weight={300} id='scenes.transactions.bitcoin.content.list.listitem.to'>{props.to}</Text>
    </TextGroup>
    <TextGroup inline>
      <Text size='13px' weight={500}>From: </Text>
      <Text size='13px' weight={300} id='scenes.transactions.bitcoin.content.list.listitem.from'>{props.from}</Text>
    </TextGroup>
  </Wrapper>
)

Addresses.propTypes = {
  to: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired
}

export default Addresses
