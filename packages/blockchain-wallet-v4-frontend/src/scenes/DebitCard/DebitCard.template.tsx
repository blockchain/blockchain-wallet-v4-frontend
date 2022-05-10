import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { Icon } from 'blockchain-info-components'
import {
  HeaderTextWrapper,
  IconBackground,
  SceneHeader,
  SceneHeaderText,
  SceneSubHeaderText
} from 'components/Layout'
import { ModalName } from 'data/modals/types'

import CardDashboard from './CardDashboard'
import CardOrder from './CardOrder'
import { Props } from './DebitCard'
import { Wrapper } from './DebitCard.model'

const DebitCard = ({
  alertActions,
  cardToken,
  cards,
  debitCardActions,
  domains,
  lockHandler,
  modalActions
}: Props) => {
  useEffect(() => {
    // Need to load cards again in case of card created in different platform while user already logged in
    debitCardActions.getCards()
    return () => {
      debitCardActions.cleanCardToken()
    }
  }, [])
  const handleOpenOrderMyCard = () =>
    modalActions.showModal(ModalName.ORDER_MY_CARD, { origin: 'DebitCardPage' })

  return (
    <Wrapper>
      <SceneHeader>
        <HeaderTextWrapper>
          <IconBackground>
            <Icon name='credit-card-sb' color='blue600' size='26px' />
          </IconBackground>
          <SceneHeaderText>
            <FormattedMessage id='copy.debit_card' defaultMessage='Debit Card' />
          </SceneHeaderText>
        </HeaderTextWrapper>
      </SceneHeader>
      <SceneSubHeaderText>
        <FormattedMessage
          id='scenes.debit_card.intro.subheader'
          defaultMessage='Taking crypto into the physical world.'
        />
      </SceneSubHeaderText>
      {cards.length === 0 ? (
        <CardOrder handleOpenOrderMyCard={handleOpenOrderMyCard} />
      ) : (
        <CardDashboard
          alertActions={alertActions}
          domains={domains}
          cardToken={cardToken}
          last4={cards[0].last4}
          cards={cards}
          debitCardActions={debitCardActions}
          lockHandler={lockHandler}
          modalActions={modalActions}
        />
      )}
    </Wrapper>
  )
}

export default DebitCard
