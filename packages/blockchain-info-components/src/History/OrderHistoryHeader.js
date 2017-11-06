import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import { Text } from '../Text'
// import { OrderHistory } from './OrderHistory'

const OrderHistory = styled.div`
  display: grid;
  grid-template-columns: 35% 25% 20% 20%;
  width: 100%;
  border: 1px solid #DDD;
  margin-top: 5px;
  background: #e0edf2;
`
const HistoryHeader = styled.div`
  padding: 4px 0px;
  padding-left: ${props => props.first ? '25px' : ''};
`

const OrderHistoryHeader = props => {
  const { children, sent, received } = props

  return (
    <OrderHistory>
      <HistoryHeader first>
        <Text size='14px' weight={500}>
          Status
        </Text>
      </HistoryHeader>
      <HistoryHeader>
        <Text size='14px' weight={500}>
          Date
        </Text>
      </HistoryHeader>
      <HistoryHeader>
        <Text size='14px' weight={500}>
          {sent}
        </Text>
      </HistoryHeader>
      <HistoryHeader>
        <Text size='14px' weight={500}>
          {received}
        </Text>
      </HistoryHeader>
    </OrderHistory>
  )
}

OrderHistoryHeader.propTypes = {
  sent: PropTypes.string.isRequired,
  received: PropTypes.string.isRequired
}

export default OrderHistoryHeader
