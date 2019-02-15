import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text, TextGroup } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

const Addresses = props => {
  const { to, from } = props

  return (
    <Wrapper>
      <TextGroup inline style={{ marginBottom: '5px' }}>
        <Text size='14px' weight={400}>
          <FormattedMessage
            id='components.transactionlistitem.addresses.to'
            defaultMessage='To: '
          />
        </Text>
        <Text size='14px' weight={400} data-e2e='transactionListItemTo'>
          {to}
        </Text>
      </TextGroup>
      <TextGroup inline>
        <Text size='14px' weight={300}>
          <FormattedMessage
            id='components.transactionlistitem.addresses.from'
            defaultMessage='From: '
          />
        </Text>
        <Text size='14px' weight={300} data-e2e='transactionListItemFrom'>
          {from}
        </Text>
      </TextGroup>
    </Wrapper>
  )
}

Addresses.propTypes = {
  to: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired
}

export default Addresses
