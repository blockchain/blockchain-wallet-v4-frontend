import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { OrderType } from '@core/types'
import { Button, Text } from 'blockchain-info-components'
import { CellHeaderText } from 'components/Table'
import { ModalName } from 'data/types'

import { TableColumnsType } from '..'

const CellWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-right: 8px;
`

export const getActionsColumn = (
  modalActions: TableColumnsType['modalActions'],
  buySellActions: TableColumnsType['buySellActions'],
  swapActions: TableColumnsType['swapActions'],
  formActions: TableColumnsType['formActions']
) => ({
  Cell: ({ row: { original: values } }) => (
    <CellWrapper>
      {values.products.includes('CustodialWalletBalance') ? (
        <>
          <Button
            data-e2e={`${values.coin}BuySellBtn`}
            height='32px'
            nature='primary'
            onClick={() => {
              buySellActions.showModal({
                cryptoCurrency: values.coin,
                orderType: OrderType.BUY,
                origin: 'Prices'
              })
            }}
            width='96px'
            style={{ marginRight: '12px' }}
          >
            <Text size='14px' color='white' weight={600}>
              {Number(values.balance) > 0 ? (
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
              formActions.destroy('initSwap')
              modalActions.showModal({
                props: {
                  origin: 'Prices'
                },
                type: ModalName.SWAP_MODAL
              })
              swapActions.setStep({
                step: 'INIT_SWAP'
              })
            }}
            width='68px'
          >
            <Text size='14px' color='blue600' weight={600}>
              <FormattedMessage id='buttons.swap' defaultMessage='Swap' />
            </Text>
          </Button>
        </>
      ) : null}
    </CellWrapper>
  ),
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.actions' defaultMessage='Actions' />
    </CellHeaderText>
  ),
  accessor: 'actions',
  disableGlobalFilter: true,
  disableSortBy: true
})
