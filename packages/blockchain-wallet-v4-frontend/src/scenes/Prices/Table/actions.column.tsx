import React, { useMemo } from 'react'
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
  analyticsActions: TableColumnsType['analyticsActions'],
  interestActions: TableColumnsType['interestActions'],
  modalActions: TableColumnsType['modalActions'],
  buySellActions: TableColumnsType['buySellActions'],
  swapActions: TableColumnsType['swapActions'],
  formActions: TableColumnsType['formActions']
) => ({
  Cell: ({ row: { original: values } }) => {
    const { coin, interestEligible, interestRate } = values

    const coinRate = useMemo(() => !!interestRate && interestRate[coin], [coin, interestRate])
    const coinEligibility = useMemo(
      () => !!interestEligible && interestEligible[coin],
      [coin, interestEligible]
    )

    const coinHasInterestRate = !!coinRate
    const coinHasInterestEligibility = !!coinEligibility && !!coinEligibility?.eligible

    const isCoinEligibleForInterest =
      Number(values.balance) > 0 && !!coinHasInterestRate && !!coinHasInterestEligibility

    const handleBuyAndSellClick = () => {
      buySellActions.showModal({
        cryptoCurrency: values.coin,
        orderType: OrderType.BUY,
        origin: 'Prices'
      })
    }

    const handleInterestClick = () => {
      interestActions.showInterestModal({
        coin: values.coin,
        step: 'DEPOSIT'
      })
    }

    const handleSwapClick = () => {
      formActions.destroy('initSwap')
      modalActions.showModal(ModalName.SWAP_MODAL, {
        origin: 'Prices'
      })
      swapActions.setStep({
        step: 'INIT_SWAP'
      })
    }

    return (
      <CellWrapper>
        {values.products.includes('CustodialWalletBalance') ? (
          <>
            <Button
              data-e2e={`${values.coin}BuySellBtn`}
              height='32px'
              nature='primary'
              onClick={handleBuyAndSellClick}
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
            {isCoinEligibleForInterest && (
              <Button
                data-e2e={`${values.coin}EarnBtn`}
                height='32px'
                nature='primary'
                onClick={handleInterestClick}
                width='68px'
                style={{ marginRight: '12px' }}
              >
                <Text size='14px' color='white' weight={600}>
                  <FormattedMessage
                    id='scenes.interest.summarycard.earnOnly'
                    defaultMessage='Earn'
                  />
                </Text>
              </Button>
            )}
            <Button
              data-e2e={`${values.coin}SwapBtn`}
              height='32px'
              nature='empty-blue'
              onClick={handleSwapClick}
              width='68px'
            >
              <Text size='14px' color='blue600' weight={600}>
                <FormattedMessage id='buttons.swap' defaultMessage='Swap' />
              </Text>
            </Button>
          </>
        ) : null}
      </CellWrapper>
    )
  },
  Header: () => (
    <CellHeaderText>
      <FormattedMessage id='copy.actions' defaultMessage='Actions' />
    </CellHeaderText>
  ),
  accessor: 'actions',
  disableGlobalFilter: true,
  disableSortBy: true
})
