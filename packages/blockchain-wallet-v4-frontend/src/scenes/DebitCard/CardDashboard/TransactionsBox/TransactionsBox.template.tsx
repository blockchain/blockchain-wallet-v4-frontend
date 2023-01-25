import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  IconMinusCircle,
  IconPlusCircle,
  PaletteColors
} from '@blockchain-com/constellation'
import { isEmpty } from 'ramda'
import styled from 'styled-components'

import { Banner, BannerType, SkeletonRectangle, Text } from 'blockchain-info-components'
import CoinBalanceDisplay from 'components/CoinWithBalance/CoinBalanceDisplay'
import { selectors } from 'data'
import { BalanceType, TransactionState, TransactionType } from 'data/components/debitCard/types'
import { ModalName } from 'data/modals/types'
import { useRemote } from 'hooks'

import { FULL_DATETIME_FORMAT } from '../../../../hooks/useDateTimeFormatter'
import {
  BoxContainer,
  BoxRow,
  BoxRowHeader,
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
    margin-left: 1rem;
  }

  width: 100%;
`

const TransactionsWrapper = styled.div`
  overflow: auto;
`

const StyledBanner = styled(Banner)`
  max-width: fit-content;
  display: inline-flex;
  margin-left: 0.5rem;
  border: unset;
`

const TransactionItem = styled(BoxRowWithBorder)`
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.grey000};
  }
`

const MAX_TRANSACTIONS = 4

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

const TransactionsBox = ({ debitCardActions, modalActions }) => {
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
            id='scenes.debit_card.dashboard.transactions.title.payment_spent'
            defaultMessage='Spent {symbol} at {place}'
            values={{ place: merchantName, symbol }}
          />
        )
      case TransactionType.REFUND:
        return (
          <FormattedMessage
            id='scenes.debit_card.dashboard.transactions.title.payment_refund'
            defaultMessage='Refund {symbol} at {place}'
            values={{ place: merchantName, symbol }}
          />
        )
      default:
        return (
          <FormattedMessage
            id='scenes.debit_card.dashboard.transactions.title.payment_type'
            defaultMessage='{type} {symbol} at {place}'
            values={{ place: merchantName, symbol, type }}
          />
        )
    }
  }

  const generateTransactionIcon = (type) => {
    const IconComponent = type === TransactionType.PAYMENT ? IconMinusCircle : IconPlusCircle
    return <IconComponent color={PaletteColors['blue-300']} label='Spent' size='small' />
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

  const handleOpenDetail = (detail) => {
    modalActions.showModal(ModalName.TRANSACTION_DETAIL_MODAL, {
      detail,
      origin: 'SettingsPage'
    })
  }

  const handleOpenListTransactions = () => {
    debitCardActions.getCardTransactions({ limit: 20 })

    modalActions.showModal(ModalName.TRANSACTION_LIST_MODAL, {
      origin: 'SettingsPage'
    })
  }

  const ListComponent = () => (
    <>
      {!data || isEmpty(data) ? (
        <EmptyList />
      ) : (
        <TransactionsWrapper>
          {data.slice(0, MAX_TRANSACTIONS).map((detail) => {
            const { id, merchantName, originalAmount, state, type, userTransactionTime } = detail

            const formattedDateTime = new Date(userTransactionTime).toLocaleString(
              'en-US',
              FULL_DATETIME_FORMAT
            )

            return (
              <TransactionItem key={id} onClick={() => handleOpenDetail(detail)}>
                {generateTransactionIcon(type)}
                <BoxRowItemTitle>
                  {generateTransactionTitle(type, originalAmount, merchantName)}
                  <BoxRowItemSubTitle>
                    {formattedDateTime}
                    <StyledBanner type={getBannerType(state)} icon={null}>
                      {state}
                    </StyledBanner>
                  </BoxRowItemSubTitle>
                </BoxRowItemTitle>
                <CoinBalanceDisplay coin={originalAmount.symbol} balance={originalAmount.value} />
              </TransactionItem>
            )
          })}
        </TransactionsWrapper>
      )}
    </>
  )

  return (
    <BoxContainer>
      <BoxRowHeader>
        <BoxRowItemTitle>
          <FormattedMessage
            id='scenes.debit_card.dashboard.transactions.title'
            defaultMessage='Recent Transactions'
          />
        </BoxRowItemTitle>

        <Button
          size='small'
          variant='minimal'
          text={
            <FormattedMessage
              id='scenes.debit_card.dashboard.see_all_transactions'
              defaultMessage='See All'
            />
          }
          onClick={handleOpenListTransactions}
        >
          See all
        </Button>
      </BoxRowHeader>
      {displayData ? <ListComponent /> : displayInitialLoading ? <LoadingDetail /> : <ErrorState />}
    </BoxContainer>
  )
}

export default TransactionsBox
