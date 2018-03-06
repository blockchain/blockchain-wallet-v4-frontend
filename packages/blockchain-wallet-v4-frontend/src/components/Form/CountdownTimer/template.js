import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { FormattedMessage } from 'react-intl'
import { Text, Tooltip } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`

const CountdownTimer = props => (
  <Wrapper>
    <Text size='12px' weight={300}>
      <FormattedMessage id='scenes.exchange.secondstep.expiry' defaultMessage='Quote expires in: {timeLeft}' values={{ timeLeft: props.timeLeft }} />
    </Text>
    <Tooltip>
      <FormattedMessage id='scenes.exchange.secondstep.expiry_tooltip' defaultMessage='This rate will expire after 10 minutes.' />
      <FormattedMessage id='scenes.exchange.secondstep.expiry_tooltip2' defaultMessage='If that happens please restart your trade.' />
    </Tooltip>
  </Wrapper>
)

CountdownTimer.propTypes = {
  timeLeft: PropTypes.string
}

CountdownTimer.defaultProps = {
  timeLeft: 'N/A'
}

export default CountdownTimer
