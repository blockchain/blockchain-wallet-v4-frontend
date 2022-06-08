import React from 'react'
import { FormattedMessage } from 'react-intl'

import { RemoteDataType } from '@core/types'
import { Button } from 'blockchain-info-components'
import CoinWithBalance from 'components/CoinWithBalance'
import { actions } from 'data'
import { AccountType } from 'data/components/debitCard/types'
import { ModalName } from 'data/modals/types'

import { BoxContainer, BoxRow, BoxRowWithBorder } from '../CardDashboard.model'
import { ErrorState, LoadingDetail } from './FundsBox.model'

type Props = {
  currentCard: RemoteDataType<string, AccountType>
  modalActions: typeof actions.modals
}

const FundsBox = ({ currentCard, modalActions }: Props) => {
  const openFundsList = () => {
    modalActions.showModal(ModalName.FUNDS_LIST, { origin: 'DebitCardDashboard' })
  }

  return (
    <BoxContainer width='380px'>
      <BoxRowWithBorder>
        {currentCard.cata({
          Failure: () => <ErrorState />,
          Loading: () => <LoadingDetail />,
          NotAsked: () => <LoadingDetail />,
          Success: (value) => <CoinWithBalance {...value.balance} />
        })}
      </BoxRowWithBorder>
      <BoxRow>
        <Button data-e2e='addFunds' nature='primary' margin='auto' disabled>
          <FormattedMessage id='buttons.add_funds' defaultMessage='Add Funds' />
        </Button>
        <Button data-e2e='changeSource' nature='empty-blue' margin='auto' onClick={openFundsList}>
          <FormattedMessage id='buttons.change_source' defaultMessage='Change Source' />
        </Button>
      </BoxRow>
    </BoxContainer>
  )
}

export default FundsBox
