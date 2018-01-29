import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  & > * { padding: 5px 0; }
`

const Addresses = props => (
  <Wrapper>
    <Text size='13px' weight={300}>
      <FormattedMessage id='scenes.transactions.bitcoin.content.list.listitem.to' defaultMessage='To : {to}' values={{ to: props.to }} />
    </Text>
    <Text size='13px' weight={300}>
      <FormattedMessage id='scenes.transactions.bitcoin.content.list.listitem.from' defaultMessage='From : {from}' values={{ from: props.from }} />
    </Text>
  </Wrapper>
)

Addresses.propTypes = {
  to: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired
}

export default Addresses
