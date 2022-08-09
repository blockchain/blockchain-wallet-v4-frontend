import React from 'react'
import { FormattedMessage } from 'react-intl'

import { OrderType } from '@core/network/api/buySell/types'
import { CoinType, WalletFiatType } from '@core/types'
import { Button } from 'blockchain-info-components'
import CoinWithBalance from 'components/CoinWithBalance'
import { actions } from 'data'
import { getCurrentCardAccount } from 'data/components/debitCard/selectors'
import { ModalName } from 'data/modals/types'
import { useRemote } from 'hooks'

import { BoxContainer, BoxRow, BoxRowWithBorder } from '../CardDashboard.model'
import { ErrorState, LoadingDetail } from './FundsBox.model'

type Props = {
  brokerageActions: typeof actions.components.brokerage
  buySellActions: typeof actions.components.buySell
  modalActions: typeof actions.modals
}

const FundsBox = ({ brokerageActions, buySellActions, modalActions }: Props) => {
  const { data, hasError, isLoading, isNotAsked } = useRemote(getCurrentCardAccount)
  const isLoadingState = (isNotAsked || isLoading) && !hasError

  const openFundsList = () => {
    modalActions.showModal(ModalName.FUNDS_LIST, { origin: 'DebitCardDashboard' })
  }
  const handleAddFunds = () => {
    // This handle will not be called if no value in data object
    const symbol = data?.balance.symbol || 'USD'

    if (window.coins[symbol].coinfig.type.name === 'FIAT') {
      brokerageActions.handleDepositFiatClick(symbol as WalletFiatType)
    } else {
      buySellActions.showModal({
        cryptoCurrency: symbol as CoinType,
        orderType: OrderType.BUY,
        origin: 'DebitCardDashboard'
      })
    }
  }

  return (
    <BoxContainer>
      <BoxRowWithBorder>
        {data && !isLoading ? (
          <CoinWithBalance {...data.balance} />
        ) : isLoadingState ? (
          <LoadingDetail />
        ) : (
          <ErrorState />
        )}
      </BoxRowWithBorder>
      <BoxRow>
        <Button
          data-e2e='addFunds'
          nature='primary'
          margin='auto'
          onClick={handleAddFunds}
          disabled={isLoadingState}
          fullwidth
        >
          <FormattedMessage id='buttons.add_funds' defaultMessage='Add Funds' />
        </Button>
        <Button
          data-e2e='changeSource'
          nature='empty-blue'
          margin='auto'
          onClick={openFundsList}
          disabled={isLoadingState}
          fullwidth
        >
          <FormattedMessage id='buttons.change_source' defaultMessage='Change Source' />
        </Button>
      </BoxRow>
    </BoxContainer>
  )
}

export default FundsBox
