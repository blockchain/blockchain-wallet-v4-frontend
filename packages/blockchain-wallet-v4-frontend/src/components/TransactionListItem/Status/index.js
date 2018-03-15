import React from 'react'
import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

const Status = props => (
  <Text weight={500} color={props.type} uppercase>
    {props.type === 'sent' && <FormattedMessage id='scenes.transactions.bitcoin.content.list.listitem.status.sent' defaultMessage='Sent' />}
    {props.type === 'received' && <FormattedMessage id='scenes.transactions.bitcoin.content.list.listitem.status.received' defaultMessage='Received' />}
    {props.type === 'transferred' && <FormattedMessage id='scenes.transactions.bitcoin.content.list.listitem.status.transferred' defaultMessage='Transferred' />}
  </Text>
)

Status.propTypes = {
  type: PropTypes.string.isRequired
}

export default Status
