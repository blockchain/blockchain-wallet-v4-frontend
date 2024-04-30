import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { OrderType } from '@core/types'
import { Button, Text } from 'blockchain-info-components'
import { CellHeaderText } from 'components/Table'
import { Analytics, ModalName } from 'data/types'

import { useDispatch } from 'react-redux'
import { trackEvent } from 'data/analytics/slice'
import { buySell, swap } from 'data/components/actions'
import { destroy } from 'redux-form'
import { modals } from 'data/actions'

const CellWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-right: 8px;
`

const ActionCell = ({ row: { original: values } }) => {
  const dispatch = useDispatch()

  const canSell = Number(values.balance) > 0

  const showActions = values.products.includes('CustodialWalletBalance')

  if (!showActions) return <CellWrapper />

  return (
    <CellWrapper>
      <Button
        data-e2e={`${values.coin}BuySellBtn`}
        height='32px'
        nature='primary'
        onClick={() => {
          dispatch(
            trackEvent({
              key: Analytics.PRICES_PAGE_BUY_CLICKED,
              properties: {}
            })
          )

          if (canSell) {
            dispatch(
              trackEvent({
                key: Analytics.PRICES_PAGE_SELL_CLICKED,
                properties: {}
              })
            )
          }

          dispatch(
            buySell.showModal({
              cryptoCurrency: values.coin,
              orderType: OrderType.BUY,
              origin: 'Prices'
            })
          )
        }}
        width='96px'
        style={{ marginRight: '12px' }}
      >
        <Text size='14px' color='white' weight={600}>
          {canSell ? (
            <FormattedMessage id='buttons.buy_sell' defaultMessage='Buy & Sell' />
          ) : (
            <FormattedMessage id='buttons.buy' defaultMessage='Buy' />
          )}
        </Text>
      </Button>
      <Button
        data-e2e={`${values.coin}SwapBtn`}
        height='32px'
        nature='empty-blue'
        onClick={() => {
          dispatch(
            trackEvent({
              key: Analytics.PRICES_PAGE_SWAP_CLICKED,
              properties: {}
            })
          )

          dispatch(destroy('initSwap'))

          dispatch(
            modals.showModal(ModalName.SWAP_MODAL, {
              origin: 'Prices'
            })
          )

          dispatch(
            swap.setStep({
              step: 'INIT_SWAP'
            })
          )
        }}
        width='68px'
      >
        <Text size='14px' color='blue600' weight={600}>
          <FormattedMessage id='buttons.swap' defaultMessage='Swap' />
        </Text>
      </Button>
    </CellWrapper>
  )
}

export const getActionsColumn = () => ({
  Cell: ActionCell,
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.actions' defaultMessage='Actions' />
    </CellHeaderText>
  ),
  accessor: 'actions',
  disableGlobalFilter: true,
  disableSortBy: true
})
