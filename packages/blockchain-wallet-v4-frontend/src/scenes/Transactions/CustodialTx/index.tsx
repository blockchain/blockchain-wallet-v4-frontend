import { FormattedMessage } from 'react-intl'
import React, { useState } from 'react'

import { CoinTypeEnum, FiatSBAndSwapTransactionType } from 'core/types'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { fiatToString } from 'core/exchange/currency'
import { Text } from 'blockchain-info-components'

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
import {
  Destination,
  IconTx,
  Origin,
  Status,
  Timestamp,
  TransactionType
} from './model'
import { Props as OwnProps } from '../TransactionList'

const CustodialTxListItem: React.FC<Props> = props => {
  const [isToggled, setIsToggled] = useState(false)
  const { tx } = props
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
              <TransactionType {...props} /> {tx.amount.symbol}
            </Text>
            <Timestamp {...props} />
          </StatusAndType>
        </Row>
        <Col width='50%'>
          <Addresses
            from={
              <>
                <Origin {...props} />
              </>
            }
            to={
              <>
                <Destination {...props} />
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
            {tx.amount.symbol in CoinTypeEnum
              ? convertBaseToStandard('FIAT', tx.amountMinor)
              : tx.amount.value}
          </StyledCoinDisplay>
          {props.coin !== props.currency && (
            <StyledFiatDisplay
              size='14px'
              weight={500}
              coin={props.coin}
              color='grey600'
              data-e2e='orderFiatAmt'
            >
              {tx.amount.symbol in CoinTypeEnum
                ? convertBaseToStandard('FIAT', tx.amountMinor)
                : tx.amount.value}
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
            <RowValue>{tx.id}</RowValue>
            {tx.type === 'SELL' && (
              <>
                <RowHeader>
                  <FormattedMessage
                    id='modals.simplebuy.summary.rate'
                    defaultMessage='Exchange Rate'
                  />
                </RowHeader>
                <RowValue data-e2e='sellRate'>
                  {fiatToString({
                    unit: tx.amount.fiatSymbol || 'USD',
                    value: tx.extraAttributes?.indicativePrice || 0
                  })}{' '}
                  / {tx.amount.symbol}
                </RowValue>
              </>
            )}
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
            <RowHeader>
              <FormattedMessage id='copy.amount' defaultMessage='Amount' />
            </RowHeader>
            <RowValue data-e2e='sbSelling'>
              {convertBaseToStandard(tx.amount.symbol, tx.amount.inputMoney)} of{' '}
              {tx.amount.symbol}
            </RowValue>
          </DetailsColumn>
        </DetailsRow>
      )}
    </TxRowContainer>
  )
}

export type Props = OwnProps & {
  tx: FiatSBAndSwapTransactionType
}

export default CustodialTxListItem
