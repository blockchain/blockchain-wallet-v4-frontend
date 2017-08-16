import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const LabelSent = styled(Text)`
  color: #F26C57;
  cursor: pointer;
`
const LabelTransferred = styled(Text)`
  color: #799EB2;
  cursor: pointer;
`
const LabelReceived = styled(Text)`
  color: #00BABC;
  cursor: pointer;
`

const StatusLabel = (props) => {
  const { handleToggle, transaction } = props

  let Component, id, text
  switch (transaction.type) {
    case 'Sent':
      Component = LabelSent
      id = 'scenes.transactions.transactionlist.transactionlistitem.sent'
      text = 'Sent'
      break
    case 'Transferred':
      Component = LabelTransferred
      id = 'scenes.transactions.transactionlist.transactionlistitem.transferred'
      text = 'Transferred'
      break
    default:
      Component = LabelReceived
      id = 'scenes.transactions.transactionlist.transactionlistitem.received'
      text = 'Received'
  }
  return <Component id={id} text={text} onClick={handleToggle} uppercase />
}

StatusLabel.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  transaction: PropTypes.shape({
    type: PropTypes.oneOf(['Sent', 'Transferred', 'Received'])
  })
}

export default StatusLabel
