import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconMinusCircle, IconPlusCircle } from '@blockchain-com/icons'
import { isEmpty } from 'ramda'
import styled from 'styled-components'

import { Banner, BannerType, SkeletonRectangle, Text } from 'blockchain-info-components'
import CoinBalanceDisplay from 'components/CoinWithBalance/CoinBalanceDisplay'
import { selectors } from 'data'
import { BalanceType, TransactionState, TransactionType } from 'data/components/debitCard/types'
import { useRemote } from 'hooks'

import {
  BoxContainer,
  BoxRow,
  BoxRowItemSubTitle,
  BoxRowItemTitle,
  BoxRowWithBorder
} from '../CardDashboard.model'

const SkeletonLoader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  > div:last-child {
    flex: 1;
    margin-left: 16px;
  }
  width: 100%;
`

const TransactionsWrapper = styled.div`
  max-height: 350px;
  overflow: auto;
`

const StyledBanner = styled(Banner)`
  max-width: fit-content;
  display: inline-flex;
  margin-left: 8px;
  border: unset;
`

const LoadingDetail = () => (
  <BoxRow>
    <SkeletonLoader>
      <SkeletonRectangle height='45px' width='100%' />
    </SkeletonLoader>
  </BoxRow>
)

const ErrorState = () => (
  <BoxRow>
    <Text size='16px' weight={500} color='grey400' capitalize lineHeight='45px'>
      <FormattedMessage id='scene.debit_card.funds_fail' defaultMessage='Failed to load balances' />
    </Text>
  </BoxRow>
)

const EmptyList = () => (
  <BoxRow>
    <BoxRowItemSubTitle style={{ margin: 'auto' }}>
      <FormattedMessage
        id='scenes.debit_card.dashboard.transactions.empty_state'
        defaultMessage='Your most recent purchases will show up here'
      />
    </BoxRowItemSubTitle>
  </BoxRow>
)

const dateTimeFormatter = (userTransactionTime) =>
  new Date(userTransactionTime).toLocaleDateString('en-US', {
    day: '2-digit',
    hour: 'numeric',
    hour12: true,
    minute: 'numeric',
    month: '2-digit',
    year: 'numeric'
  })

const TransactionsBox = () => {
  const { data, isLoading, isNotAsked } = useRemote(
    selectors.components.debitCard.getCardTransactions
  )
  const displayInitialLoading = isLoading || isNotAsked
  const displayData = data && !displayInitialLoading

  const generateTransactionTitle = (
    type: TransactionType,
    { symbol }: BalanceType,
    merchantName: string
  ) => {
    switch (type) {
      case TransactionType.PAYMENT:
        return (
          <FormattedMessage
            id='scenes.debit_card.dashboard.transactions.title.payment'
            defaultMessage='Spent {symbol} at {place}'
            values={{ place: merchantName, symbol }}
          />
        )
      case TransactionType.REFUND:
        return (
          <FormattedMessage
            id='scenes.debit_card.dashboard.transactions.title.payment'
            defaultMessage='Refund {symbol} at {place}'
            values={{ place: merchantName, symbol }}
          />
        )
      default:
        return (
          <FormattedMessage
            id='scenes.debit_card.dashboard.transactions.title.payment'
            defaultMessage='{type} {symbol} at {place}'
            values={{ place: merchantName, symbol, type }}
          />
        )
    }
  }

  const generateTransactionIcon = (type) => {
    return type === TransactionType.PAYMENT ? <IconMinusCircle /> : <IconPlusCircle />
  }

  const getBannerType = (state: TransactionState) => {
    switch (state) {
      case TransactionState.COMPLETED:
        return BannerType.SUCCESS
      case TransactionState.CANCELLED:
      case TransactionState.DECLINED:
        return BannerType.WARNING
      case TransactionState.PENDING:
      default:
        return BannerType.INFORMATIONAL
    }
  }

  const ListComponent = () => (
    <>
      {!data || isEmpty(data) ? (
        <EmptyList />
      ) : (
        <TransactionsWrapper>
          {data.map(({ id, merchantName, originalAmount, state, type, userTransactionTime }) => (
            <BoxRowWithBorder key={id}>
              <Icon color='blue300' label='Spent' size='sm'>
                {generateTransactionIcon(type)}
              </Icon>
              <BoxRowItemTitle>
                {generateTransactionTitle(type, originalAmount, merchantName)}
                <BoxRowItemSubTitle>
                  {dateTimeFormatter(userTransactionTime)}
                  <StyledBanner type={getBannerType(state)} icon={null}>
                    {state}
                  </StyledBanner>
                </BoxRowItemSubTitle>
              </BoxRowItemTitle>
              <CoinBalanceDisplay coin={originalAmount.symbol} balance={originalAmount.value} />
            </BoxRowWithBorder>
          ))}
        </TransactionsWrapper>
      )}
    </>
  )

  return (
    <BoxContainer width='662px'>
      <BoxRowWithBorder>
        <BoxRowItemTitle>
          <FormattedMessage
            id='scenes.debit_card.dashboard.transactions.title'
            defaultMessage='Recent Transactions'
          />
        </BoxRowItemTitle>
      </BoxRowWithBorder>
      {displayData ? <ListComponent /> : displayInitialLoading ? <LoadingDetail /> : <ErrorState />}
    </BoxContainer>
  )
}

export default TransactionsBox
