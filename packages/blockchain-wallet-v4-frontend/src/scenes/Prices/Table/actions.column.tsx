import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Text } from 'blockchain-info-components'

import { CellHeaderText } from '.'

const CellWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding-right: 8px;
`

export const getActionsColumn = modalActions => ({
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.actions' defaultMessage='Actions' />
    </CellHeaderText>
  ),
  accessor: 'actions',
  disableGlobalFilter: true,
  disableSortBy: true,
  Cell: ({ row: { original: values } }) => (
    <CellWrapper>
      <Button
        data-e2e={`${values.coin}BuySellBtn`}
        height='32px'
        nature='primary'
        onClick={() =>
          modalActions.showModal('SIMPLE_BUY_MODAL', {
            origin: 'Prices'
          })
        }
        width='96px'
        style={{ marginRight: '12px' }}
      >
        <Text size='14px' color='white' weight={600}>
          {Number(values.balance) > 0 ? (
            <FormattedMessage
              id='buttons.buy_sell'
              defaultMessage='Buy & Sell'
            />
          ) : (
            <FormattedMessage id='buttons.buy' defaultMessage='Buy' />
          )}
        </Text>
      </Button>
      <Button
        data-e2e={`${values.coin}SwapBtn`}
        height='32px'
        nature='empty-blue'
        onClick={() =>
          modalActions.showModal('SWAP_MODAL', {
            origin: 'Prices'
          })
        }
        width='68px'
      >
        <Text size='14px' color='blue600' weight={600}>
          <FormattedMessage id='buttons.swap' defaultMessage='Swap' />
        </Text>
      </Button>
    </CellWrapper>
  )
})
