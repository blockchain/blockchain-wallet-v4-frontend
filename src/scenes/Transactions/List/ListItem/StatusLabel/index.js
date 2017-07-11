import React from 'react'
import styled from 'styled-components'

import { Text } from 'components/generic/Text'

const StatusLabel = (props) => {
  let Component, id, text
  switch (props.transaction.type) {
    case 'Sent':
      Component = styled(Text)`color: #F26C57; cursor: pointer;`
      id = 'scenes.transactions.transactionlist.transactionlistitem.sent'
      text = 'Sent'
      break
    case 'Transferred':
      Component = styled(Text)`color: #799EB2; cursor: pointer;`
      id = 'scenes.transactions.transactionlist.transactionlistitem.transferred'
      text = 'Transferred'
      break
    default:
      Component = styled(Text)`color: #00BABC; cursor: pointer;`
      id = 'scenes.transactions.transactionlist.transactionlistitem.received'
      text = 'Received'
  }
  return <Component id={id} text={text} onClick={props.clickDetails} uppercase />
}

export default StatusLabel
