import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text, TextGroup, Tooltip } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

const hasLabel = (io) => io.label

const Addresses = props => {
  const labelTo = <Text size='13px' weight={300} id='scenes.transactions.content.list.listitem.to'>{props.to}</Text>
  const labelFrom = <Text size='13px' weight={300} id='scenes.transactions.content.list.listitem.from'>{props.from}</Text>
  return (
    <Wrapper>
      <TextGroup inline>
        <Text size='13px' weight={500}>
          <FormattedMessage id='scenes.transactions.content.list.listitem.to' defaultMessage='To: ' />
        </Text>
        <Tooltip width='auto' label={labelTo} hover={props.outputs && props.outputs.some(hasLabel)}>
          { props.outputs && props.outputs.map((output) => output.label && <Text size='12px' weight={300}>{output.address}</Text>) }
        </Tooltip>
      </TextGroup>
      <TextGroup inline>
        <Text size='13px' weight={500}>
          <FormattedMessage id='scenes.transactions.content.list.listitem.to' defaultMessage='From: ' />
        </Text>
        <Tooltip width='auto' label={labelFrom} hover={props.inputs && props.inputs.some(hasLabel)}>
          { props.inputs && props.inputs.map((input) => input.label && <Text size='12px' weight={300}>{input.address}</Text>) }
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
