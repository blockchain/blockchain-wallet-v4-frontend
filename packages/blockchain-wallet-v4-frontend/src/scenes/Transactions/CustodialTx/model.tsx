import { Icon as BCIcon, Text } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import moment from 'moment'
import React from 'react'
import styled from 'styled-components'

import { CoinTypeEnum } from 'core/types'
import { IconWrapper } from '../components'
import { Props } from '.'

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
            size='20px'
            color='fiat'
            name={props.tx.type === 'DEPOSIT' ? 'arrow-down' : 'arrow-up'}
          />
        </IconWrapper>
      )
    case 'CREATED':
    case 'FRAUD_REVIEW':
    case 'MANUAL_REVIEW':
    case 'PENDING':
    case 'PENDING_DEPOSIT':
    case 'CLEARED':
      return (
        <IconWrapper color='grey000'>
          <Icon
            color='grey600'
            size='20px'
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
            size='20px'
            name={props.tx.type === 'DEPOSIT' ? 'arrow-down' : 'arrow-up'}
          />
        </IconWrapper>
      )
    default:
      return (
        <IconWrapper color='grey000'>
          <Icon
            size='20px'
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
      case 'MANUAL_REVIEW':
        return 'In Review'
      default:
        return 'In Progress'
    }
  }

  return (
    <Text
      size='14px'
      weight={500}
      color='grey600'
      style={{ marginTop: '4px' }}
      data-e2e='txTimeOrStatus'
    >
      {getTimeOrStatus()}
    </Text>
  )
}

export const DepositOrWithdrawal = (props: Props) => {
  // if (props.tx.amount.symbol in CoinTypeEnum) {
  //   return <FormattedMessage id='buttons.transfer' defaultMessage='Transfer' />
  // } else {
  switch (props.tx.type) {
    case 'DEPOSIT':
      return <FormattedMessage id='buttons.deposit' defaultMessage='Deposit' />
    case 'WITHDRAWAL':
      return (
        <FormattedMessage id='buttons.withdraw' defaultMessage='Withdraw' />
      )
  }
  // }
}

export const Origin = (props: Props) => {
  switch (props.tx.type) {
    case 'DEPOSIT':
      if (props.tx.amount.symbol in CoinTypeEnum) {
        return <>Wallet</>
      }

      return <>Bank Account</>
    case 'WITHDRAWAL':
      return <>Trading Wallet</>
  }
}

export const Destination = (props: Props) => {
  switch (props.tx.type) {
    case 'DEPOSIT':
      return <>Trading Wallet</>
    case 'WITHDRAWAL':
      if (props.tx.amount.symbol in CoinTypeEnum) {
        return <>Wallet</>
      }

      return <>Bank Account</>
  }
}
