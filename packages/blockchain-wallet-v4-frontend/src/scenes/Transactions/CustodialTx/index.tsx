import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

import { CustodialTransactionRow } from '../components'
import { SBTransactionType } from 'core/types'

import { fiatToString } from 'core/exchange/currency'
import { IconTx, Timestamp } from './model'

const Col = styled.div<{ width: string }>`
  width: ${props => props.width};
`
const Row = styled(Col)`
  display: flex;
  align-items: center;
`
const Status = styled.div`
  margin-left: 16px;
`

const CustodialTxListItem: React.FC<Props> = props => {
  return (
    <CustodialTransactionRow>
      <Row width='30%'>
        <IconTx {...props} />
        <Status>
          <Text size='16px' color='grey800' weight={600}>
            {props.tx.type === 'DEPOSIT' ? (
              <FormattedMessage id='buttons.deposit' defaultMessage='Deposit' />
            ) : (
              <FormattedMessage
                id='buttons.withdraw'
                defaultMessage='Withdraw'
              />
            )}
          </Text>
          <Timestamp {...props} />
        </Status>
      </Row>
      <Col width='50%'>
        <Text size='16px' weight={600} color='grey800'>
          <FormattedMessage id='copy.from' defaultMessage='From' />
          {': '}
          {props.tx.amount.symbol}{' '}
          {props.tx.type === 'DEPOSIT' ? 'Bank Account' : 'Wallet'}
        </Text>
        <Text
          size='14px'
          weight={500}
          color='grey600'
          style={{ marginTop: '4px' }}
        >
          <FormattedMessage id='copy.to' defaultMessage='To' />
          {': '}
          {props.tx.amount.symbol}{' '}
          {props.tx.type === 'DEPOSIT' ? 'Wallet' : 'Bank Account'}
        </Text>
      </Col>
      <Col width='20%' style={{ textAlign: 'right' }}>
        <Text size='16px' weight={600} color='grey800'>
          {fiatToString({
            value: props.tx.amount.value,
            unit: props.tx.amount.symbol
          })}
        </Text>
      </Col>
    </CustodialTransactionRow>
  )
}

export type Props = {
  tx: SBTransactionType
}

export default CustodialTxListItem
