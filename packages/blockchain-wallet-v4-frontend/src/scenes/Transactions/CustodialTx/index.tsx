import { FormattedMessage } from 'react-intl'
import { Text } from 'blockchain-info-components'
import React from 'react'
import styled from 'styled-components'

import { CoinTypeEnum, SBTransactionType } from 'core/types'
import { CustodialTransactionRow } from '../components'
import CoinDisplay from 'components/Display/CoinDisplay'
import FiatDisplay from 'components/Display/FiatDisplay'

import { Destination, IconTx, Origin, Timestamp } from './model'
import { Props as OwnProps } from '../TransactionList'

const StyledCustodialTransactionRow = styled(CustodialTransactionRow)`
  cursor: initial;
`
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
const StyledCoinDisplay = styled(CoinDisplay)`
  justify-content: flex-end;
`
const StyledFiatDisplay = styled(FiatDisplay)`
  justify-content: flex-end;
`

const CustodialTxListItem: React.FC<Props> = props => {
  return (
    <StyledCustodialTransactionRow>
      <Row width='30%'>
        <IconTx {...props} />
        <Status data-e2e='orderStatusColumn'>
          <Text size='16px' color='grey800' weight={600} data-e2e='txTypeText'>
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
        <Text size='16px' weight={600} color='grey800' data-e2e='txFrom'>
          <FormattedMessage id='copy.from' defaultMessage='From' />
          {': '}
          {props.tx.amount.symbol} <Origin {...props} />
        </Text>
        <Text
          size='14px'
          weight={500}
          color='grey600'
          style={{ marginTop: '4px' }}
          data-e2e='txTo'
        >
          <FormattedMessage id='copy.to' defaultMessage='To' />
          {': '}
          {props.tx.amount.symbol} <Destination {...props} />
        </Text>
      </Col>
      <Col
        width='20%'
        style={{ textAlign: 'right' }}
        data-e2e='orderAmountColumn'
      >
        <StyledCoinDisplay
          coin={props.coin}
          size='16px'
          weight={600}
          color='grey800'
          data-e2e='orderFiatAmt'
        >
          {props.tx.amount.symbol in CoinTypeEnum
            ? props.tx.amountMinor
            : props.tx.amount.value}
        </StyledCoinDisplay>
        {props.coin !== props.currency && (
          <StyledFiatDisplay
            coin={props.coin}
            size='14px'
            weight={500}
            color='grey600'
            style={{ marginTop: '4px', alignSelf: 'flex-end' }}
          >
            {props.tx.amount.symbol in CoinTypeEnum
              ? props.tx.amountMinor
              : props.tx.amount.value}
          </StyledFiatDisplay>
        )}
      </Col>
    </StyledCustodialTransactionRow>
  )
}

export type Props = OwnProps & {
  tx: SBTransactionType
}

export default CustodialTxListItem
