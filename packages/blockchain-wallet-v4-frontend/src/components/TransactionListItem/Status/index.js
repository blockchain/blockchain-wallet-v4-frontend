import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const StatusText = styled(Text)`
  font-size: ${props => props.mobileSize};
  @media (min-width: 480px){
    font-size: ${props => props.size};
  }
`

const Status = props => (
  <StatusText mobileSize='14px' size='16px' weight={500} color={props.type} uppercase>
    {props.type === 'sent' && <FormattedMessage id='scenes.transactions.bitcoin.content.list.listitem.status.sent' defaultMessage='Sent' />}
    {props.type === 'received' && <FormattedMessage id='scenes.transactions.bitcoin.content.list.listitem.status.received' defaultMessage='Received' />}
    {props.type === 'transferred' && <FormattedMessage id='scenes.transactions.bitcoin.content.list.listitem.status.transferred' defaultMessage='Transferred' />}
  </StatusText>
)

Status.propTypes = {
  type: PropTypes.string.isRequired
}

export default Status
