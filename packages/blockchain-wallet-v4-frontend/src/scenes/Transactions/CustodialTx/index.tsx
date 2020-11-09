import { Text } from 'blockchain-info-components'
import React, { useState } from 'react'

import {
  Addresses,
  Col,
  DetailsColumn,
  DetailsRow,
  Row,
  RowHeader,
  RowValue,
  StatusAndType,
  StyledCoinDisplay,
  StyledFiatDisplay,
  TxRow,
  TxRowContainer
} from '../components'
import { CoinTypeEnum, SBTransactionType } from 'core/types'

import {
  DepositOrWithdrawal,
  Destination,
  IconTx,
  Origin,
  Status,
  Timestamp
} from './model'
import { FormattedMessage } from 'react-intl'
import { Props as OwnProps } from '../TransactionList'

const CustodialTxListItem: React.FC<Props> = props => {
  const [isToggled, setIsToggled] = useState(false)

  return (
    <TxRowContainer onClick={() => setIsToggled(!isToggled)}>
      <TxRow>
        <Row width='30%'>
          <IconTx {...props} />
          <StatusAndType data-e2e='orderStatusColumn'>
            <Text
              size='16px'
              color='grey800'
              weight={600}
              data-e2e='txTypeText'
            >
              <DepositOrWithdrawal {...props} /> {props.tx.amount.symbol}
            </Text>
            <Timestamp {...props} />
          </StatusAndType>
        </Row>
        <Col width='50%'>
          <Addresses
            from={
              <>
                {props.tx.amount.symbol} <Origin {...props} />
              </>
            }
            to={
              <>
                {props.tx.amount.symbol} <Destination {...props} />
              </>
            }
          />
        </Col>
        <Col
          width='20%'
          style={{ textAlign: 'right' }}
          data-e2e='orderAmountColumn'
        >
          <StyledCoinDisplay coin={props.coin} data-e2e='orderCoinAmt'>
            {props.tx.amount.symbol in CoinTypeEnum
              ? props.tx.amountMinor
              : props.tx.amount.value}
          </StyledCoinDisplay>
          {props.coin !== props.currency && (
            <StyledFiatDisplay
              size='14px'
              weight={500}
              coin={props.coin}
              color='grey600'
              data-e2e='orderFiatAmt'
            >
              {props.tx.amount.symbol in CoinTypeEnum
                ? props.tx.amountMinor
                : props.tx.amount.value}
            </StyledFiatDisplay>
          )}
        </Col>
      </TxRow>
      {isToggled && (
        <DetailsRow>
          <DetailsColumn>
            <RowHeader>
              <FormattedMessage
                defaultMessage='Transaction ID'
                id='modals.simplebuy.summary.txid'
              />
            </RowHeader>
            <RowValue>{props.tx.id}</RowValue>
          </DetailsColumn>
          <DetailsColumn />
          <DetailsColumn>
            <RowHeader>
              <FormattedMessage
                defaultMessage='Status'
                id='components.txlistitem.status'
              />
            </RowHeader>
            <RowValue>
              <Status {...props} />
            </RowValue>
          </DetailsColumn>
        </DetailsRow>
      )}
    </TxRowContainer>
  )
}

export type Props = OwnProps & {
  tx: SBTransactionType
}

export default CustodialTxListItem
