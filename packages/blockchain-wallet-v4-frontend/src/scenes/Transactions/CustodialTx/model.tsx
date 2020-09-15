import { Icon as BCIcon, Text } from 'blockchain-info-components'
import moment from 'moment'
import React from 'react'
import styled, { DefaultTheme } from 'styled-components'

import { Props } from '.'

const IconWrapper = styled.div<{ color: keyof DefaultTheme }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border-radius: 16px;
  background: ${props => props.theme[props.color]};
`

const Icon = styled(BCIcon)`
  size: 18px;
  font-weight: 600;
`

export const IconTx = (props: Props) => {
  switch (props.tx.state) {
    case 'COMPLETE':
      return (
        <IconWrapper color='fiat-light'>
          <Icon
            color='fiat'
            name={props.tx.type === 'DEPOSIT' ? 'arrow-down' : 'arrow-up'}
          />
        </IconWrapper>
      )
    case 'CREATED':
    case 'FRAUD_REVIEW':
    case 'MANUAL_REVIEW':
    case 'PENDING':
    case 'CLEARED':
      return (
        <IconWrapper color='grey000'>
          <Icon
            color='grey600'
            name={props.tx.type === 'DEPOSIT' ? 'arrow-down' : 'arrow-up'}
          />
        </IconWrapper>
      )
    case 'FAILED':
    case 'REFUNDED':
    case 'REJECTED':
    case 'UNIDENTIFIED':
      return (
        <IconWrapper color='red000'>
          <Icon
            color='red600'
            name={props.tx.type === 'DEPOSIT' ? 'arrow-down' : 'arrow-up'}
          />
        </IconWrapper>
      )
    default:
      return (
        <IconWrapper color='grey000'>
          <Icon
            size='16px'
            weight={500}
            color='grey600'
            name={'question-in-circle'}
          />
        </IconWrapper>
      )
  }
}

export const Timestamp = (props: Props) => {
  const getTimeOrStatus = () => {
    switch (props.tx.state) {
      case 'COMPLETE':
        return moment(props.tx.insertedAt).format('MMM. D, YYYY')
      case 'FAILED':
      case 'REFUNDED':
      case 'REJECTED':
      case 'UNIDENTIFIED':
        return 'Failed'
      default:
        return 'In Progress'
    }
  }

  return (
    <Text size='14px' weight={500} color='grey600' style={{ marginTop: '4px' }}>
      {getTimeOrStatus()}
    </Text>
  )
}
