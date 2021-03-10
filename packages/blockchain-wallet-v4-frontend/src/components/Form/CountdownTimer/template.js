import React from 'react'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Icon, Text, Tooltip, TooltipHost } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;

  > :first-child {
    margin-right: 5px;
  }
`

const CountdownTimer = props => (
  <Wrapper {...props}>
    {!props.payProInvoice ? (
      <Text size='11px' weight={400} color='grey400'>
        <FormattedMessage
          id='scenes.exchange.secondstep.expiry_text'
          defaultMessage='This quote will refresh in: {timeLeft}'
          values={{ timeLeft: props.timeLeft }}
        />
      </Text>
    ) : (
      <Text
        size='14px'
        weight={500}
        color={getCountdownColor(props.expiryDate)}
      >
        <FormattedMessage
          id='modals.sendbtc.firststep.paypro_expiry_text'
          defaultMessage='Remaining time {timeLeft}'
          values={{ timeLeft: props.timeLeft }}
        />
      </Text>
    )}
    {!props.hideTooltip ? (
      <TooltipHost id='CountdownTimer.tooltip'>
        <Icon name='question-in-circle' />
      </TooltipHost>
    ) : null}
    <Tooltip id='CountdownTimer.tooltip'>
      <FormattedMessage
        id='scenes.exchange.secondstep.expiry.tooltip1'
        defaultMessage='This rate will expire after {time}.'
        values={{ time: props.tooltipExpiryTime }}
      />
      <FormattedMessage
        id='scenes.exchange.secondstep.expiry.tooltip2'
        defaultMessage='If that happens please restart your trade.'
      />
    </Tooltip>
  </Wrapper>
)

CountdownTimer.propTypes = {
  timeLeft: PropTypes.string
}

export const getCountdownColor = expiryDateString => {
  const expiryDate = new Date(expiryDateString)
  const oneMinuteLimit = new Date(expiryDate - 60000)
  const fiveMinuteLimit = new Date(expiryDate - 5 * 60000)
  const now = new Date(Date.now())
  return now > oneMinuteLimit
    ? 'error'
    : now > fiveMinuteLimit
    ? 'warn'
    : 'grey400'
}

CountdownTimer.defaultProps = {
  timeLeft: 'N/A'
}

export default CountdownTimer
