import { FormattedMessage } from 'react-intl'
import { prop } from 'ramda'
import React from 'react'
import styled from 'styled-components'

import {
  Banner,
  Text,
  TooltipHost,
  TooltipIcon
} from 'blockchain-info-components'
import Confirmations from './Confirmations'
import Description from './Description'
import FiatAtTime from './FiatAtTime'
import media from 'services/ResponsiveService'
import Status from './Status'
import TransactionFee from './TransactionFee'

import {
  Addresses,
  IconTx,
  Row,
  StatusAndType,
  StyledCoinDisplay,
  StyledFiatDisplay,
  Timestamp,
  TxRow
} from '../components'
import { Props } from '.'

const TransactionRowContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
`
const DetailsRow = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 20px;
`
const DetailsColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 33.333%;
  &:last-child {
    align-items: flex-end;
  }
`
const BannerWrapper = styled.div`
  margin-left: 8px;
`
const AddressesColumn = styled.div`
  display: none;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  white-space: nowrap;
  width: 50%;
  ${media.atLeastTabletL`
    display: flex;  
  `}
`
const AmountColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 20%;
  align-items: flex-end;
  ${media.mobile`
    min-width: 50%;
  `};
`
const IOAddressText = styled(Text)`
  display: flex;
  align-items: center;
`

const NonCustodialTx = ({
  coin,
  coinTicker,
  currency,
  isToggled,
  transaction,
  handleToggle,
  handleEditDescription,
  handleRetrySendEth,
  onViewTxDetails
}: Props & ParentClassProps) => (
  <TransactionRowContainer
    className={isToggled ? 'active' : ''}
    data-e2e='transactionRow'
  >
    <TxRow onClick={() => handleToggle()}>
      <Row data-e2e='transactionDateColumn' width='30%'>
        <IconTx coin={coin} type={transaction.type} />
        <StatusAndType data-e2e='transactionListItemStatus'>
          <Status type={transaction.type} coinTicker={coinTicker} />
          <Timestamp time={Number(transaction.time) * 1000} />
        </StatusAndType>
        {'fromWatchOnly' in transaction &&
          transaction.toWatchOnly &&
          transaction.fromWatchOnly && (
            <BannerWrapper>
              <Banner label='true' type='informational'>
                <FormattedMessage
                  id='components.txlistitem.watchonly'
                  defaultMessage='Non-Spendable'
                />
              </Banner>
            </BannerWrapper>
          )}
        {'rbf' in transaction && transaction.rbf && (
          <BannerWrapper>
            <Banner label='true' type='informational'>
              <FormattedMessage
                id='components.txlistitem.rbf'
                defaultMessage='Replace-By-Fee'
              />
            </Banner>
          </BannerWrapper>
        )}
        {'erc20' in transaction && transaction.erc20 && (
          <BannerWrapper>
            <Banner label='true' type='informational'>
              <FormattedMessage
                id='components.txlistitem.erc20fee'
                defaultMessage='ERC20 Fee'
              />
            </Banner>
          </BannerWrapper>
        )}
        {'state' in transaction &&
          transaction.state === 'PENDING' &&
          transaction.type === 'sent' && (
            <TooltipHost id='transaction.pending.eth' data-place='right'>
              <BannerWrapper
                onClick={e =>
                  handleRetrySendEth(e, transaction.hash, transaction.erc20)
                }
              >
                <Banner label='true'>
                  <FormattedMessage
                    id='components.txlistitem.retrytx'
                    defaultMessage='Resend Transaction'
                  />
                </Banner>
              </BannerWrapper>
            </TooltipHost>
          )}
      </Row>
      <AddressesColumn data-e2e='transactionAddressesColumn'>
        <Addresses to={transaction.to} from={transaction.from} />
      </AddressesColumn>
      <AmountColumn data-e2e='transactionAmountColumn'>
        <StyledCoinDisplay coin={coin}>{transaction.amount}</StyledCoinDisplay>
        <StyledFiatDisplay coin={coin} size='14px' weight={500} color='grey600'>
          {transaction.amount}
        </StyledFiatDisplay>
      </AmountColumn>
    </TxRow>
    {isToggled && (
      <DetailsRow data-e2e='expandedTransactionRow'>
        <DetailsColumn data-e2e='descriptionTransactionColumn'>
          <Text size='14px' weight={500} style={{ marginBottom: '5px' }}>
            <FormattedMessage
              id='components.txlistitem.description'
              defaultMessage='Description'
            />
          </Text>
          <Description
            description={transaction.description}
            handleEditDescription={handleEditDescription}
          />
          {coin === 'BTC' && (
            <React.Fragment>
              <Text
                size='14px'
                capitalize
                weight={500}
                style={{ marginBottom: '5px', marginTop: '15px' }}
              >
                <FormattedMessage
                  id='components.txlistitem.valueattime'
                  defaultMessage='Value When {type}'
                  values={{ type: transaction.type }}
                />
              </Text>
              <FiatAtTime
                amount={transaction.amount}
                hash={transaction.hash}
                time={transaction.time}
                type={transaction.type}
                currency={currency}
              />
            </React.Fragment>
          )}
          {transaction.coin === 'XLM' && transaction.memo && (
            <React.Fragment>
              <Text
                size='14px'
                capitalize
                weight={500}
                style={{ marginBottom: '5px', marginTop: '15px' }}
              >
                <FormattedMessage
                  id='components.txlistitem.memo'
                  defaultMessage='Memo'
                />
                &nbsp;
                {transaction.memoType}
              </Text>
              <Text
                size='14px'
                capitalize
                weight={400}
                data-e2e='xlmTransactionMemo'
              >
                {transaction.memo}
              </Text>
            </React.Fragment>
          )}
        </DetailsColumn>
        {'inputs' in transaction && transaction.inputs && transaction.outputs && (
          <DetailsColumn data-e2e='sentFromTransactionColumn'>
            <Text size='14px' weight={500} style={{ marginBottom: '5px' }}>
              <FormattedMessage
                id='components.txlistitem.sentfrom'
                defaultMessage='Sent From'
              />
            </Text>
            {prop('inputs', transaction).map(input => (
              <Text size='14px' weight={400}>
                {input.address}
              </Text>
            ))}
            <Text
              size='14px'
              weight={500}
              style={{ marginBottom: '5px', marginTop: '15px' }}
            >
              <FormattedMessage
                id='components.txlistitem.receivedby'
                defaultMessage='Received By'
              />
            </Text>
            {prop('outputs', transaction).map(output => (
              <IOAddressText size='14px' weight={400}>
                {output.address}
                {output.change && (
                  <React.Fragment>
                    <span>&nbsp;</span>
                    <FormattedMessage
                      id='components.txlistitem.change'
                      defaultMessage='(Change Address)'
                    />
                    <TooltipHost id='txlist.change.tooltip'>
                      <TooltipIcon name='info' />
                    </TooltipHost>
                  </React.Fragment>
                )}
              </IOAddressText>
            ))}
          </DetailsColumn>
        )}
        <DetailsColumn data-e2e='statusTransactionColumn'>
          <Text size='14px' weight={500} style={{ marginBottom: '5px' }}>
            <FormattedMessage
              id='components.txlistitem.status'
              defaultMessage='Status'
            />
          </Text>
          <Confirmations
            coin={coin}
            hash={transaction.hash}
            txBlockHeight={transaction.blockHeight}
            onViewTxDetails={onViewTxDetails}
          />
          {transaction.type !== 'received' && 'fee' in transaction && (
            <TransactionFee
              coin={coin}
              feeR={transaction.fee}
              hash={transaction.hash}
            />
          )}
        </DetailsColumn>
      </DetailsRow>
    )}
  </TransactionRowContainer>
)

type ParentClassProps = {
  handleEditDescription: (value: any) => void
  handleRetrySendEth: (e: any, txHash: string, isErc20: boolean) => void
  handleToggle: () => void
  isToggled: boolean
  onViewTxDetails: (value: any) => void
}

export default NonCustodialTx
