import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'
import ValueWhenReceived from './ValueWhenReceived'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  > *:first-child { margin-right: 3px; }
`

const Success = props => (
  <Wrapper>
    <Text size='12px' weight={300}>
      {props.type === 'sent'
        ? <FormattedMessage id='components.transactionlistitem.fiatattime.valuewhensent' defaultMessage='Value when sent: ' />
        : <FormattedMessage id='components.transactionlistitem.fiatattime.valuewhenreceived' defaultMessage='Value when received: ' />
      }
    </Text>
    <ValueWhenReceived
      currency={props.currency}
      amount={props.amount}
      hash={props.hash}
      time={props.time}
    />
  </Wrapper>
)

Success.propTypes = {
  currency: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  hash: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired
}

export default Success
