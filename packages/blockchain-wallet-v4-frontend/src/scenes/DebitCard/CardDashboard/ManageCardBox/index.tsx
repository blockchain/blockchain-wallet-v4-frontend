import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon } from 'blockchain-info-components'
import { ModalName } from 'data/modals/types'

import { BoxContainer, BoxRow, BoxRowItemTitle, BoxRowWithBorder } from '../model'

const TerminateButtonWrapper = styled(Button)`
  color: ${(props) => props.theme.red600};
`

const ManageCardBox = ({ cards, debitCardActions, modalActions }) => {
  const onTerminate = () => {
    modalActions.showModal(ModalName.CUSTOMIZABLE_CONFIRM_MODAL, {
      body: (
        <FormattedMessage
          id='scenes.debit_card.dashboard.confirm_terminate'
          defaultMessage='Terminate Card?'
        />
      ),
      onConfirm: () => debitCardActions.terminateCard(cards[0].id)
    })
  }

  return (
    <BoxContainer style={{ minWidth: '380px' }}>
      <BoxRowWithBorder>
        <BoxRowItemTitle>
          <FormattedMessage
            id='scenes.debit_card.dashboard.manage_card.header'
            defaultMessage='Manage Card'
          />
        </BoxRowItemTitle>
      </BoxRowWithBorder>
      <BoxRow>
        <TerminateButtonWrapper data-e2e='closeCardButton' onClick={onTerminate} fullwidth>
          <Icon name='trash' />
          <FormattedMessage
            id='scenes.debit_card.dashboard.manage_card.close_card'
            defaultMessage='Close Card'
          />
        </TerminateButtonWrapper>
      </BoxRow>
    </BoxContainer>
  )
}

export default ManageCardBox
