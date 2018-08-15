import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { filter } from 'ramda'

import { Text, TextGroup, TooltipHost } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`

const Label = styled(Text)`
  font-size: 13px;
  font-weight: 300;
`

const hasLabel = io => io.label
const notChange = io => !io.change

const BtcAddresses = props => {
  const { from, to, outputs, inputs } = props
  const outputTooltip = filter(hasLabel, filter(notChange, outputs))
    .map((output, index) => output.address)
    .join('\n<br />\n')

  const inputTooltip = filter(hasLabel, inputs)
    .map((input, index) => input.address)
    .join('\n<br />\n')

  return (
    <Wrapper>
      <TextGroup inline>
        <Text size='13px' weight={500}>
          <FormattedMessage
            id='components.transactionlistitem.addresses.to'
            defaultMessage='To: '
          />
        </Text>
        <TooltipHost tip={outputTooltip} id='addr'>
          <Label>{to}</Label>
        </TooltipHost>
      </TextGroup>
      <TextGroup inline>
        <Text size='13px' weight={500}>
          <FormattedMessage
            id='components.transactionlistitem.addresses.from'
            defaultMessage='From: '
          />
        </Text>
        <TooltipHost tip={inputTooltip} id='addr'>
          <Label>{from}</Label>
        </TooltipHost>
      </TextGroup>
    </Wrapper>
  )
}

BtcAddresses.propTypes = {
  to: PropTypes.string.isRequired,
  from: PropTypes.string.isRequired
}

export default BtcAddresses
