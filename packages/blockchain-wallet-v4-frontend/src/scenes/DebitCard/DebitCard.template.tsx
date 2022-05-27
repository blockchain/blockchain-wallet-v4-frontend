import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { Icon, SkeletonRectangle } from 'blockchain-info-components'
import { Container } from 'components/Box'
import {
  HeaderTextWrapper,
  IconBackground,
  SceneHeader,
  SceneHeaderText,
  SceneSubHeaderText
} from 'components/Layout'
import { selectors } from 'data'
import { ModalName } from 'data/modals/types'
import { useRemote } from 'hooks'

import CardDashboard from './CardDashboard'
import CardOrder from './CardOrder'
import { Props } from './DebitCard'
import { Wrapper } from './DebitCard.model'

const Loading = () => {
  return (
    <Container>
      <SkeletonRectangle width='330px' height='270px' />
    </Container>
  )
}

const DebitCard = ({
  alertActions,
  cardToken,
  debitCardActions,
  domains,
  lockHandler,
  modalActions
}: Props) => {
  useEffect(() => {
    debitCardActions.getCards()
    return () => {
      debitCardActions.cleanCardData()
    }
  }, [])

  const cardsR = useRemote(selectors.components.debitCard.getCards)
  const { data: cards = [], isLoading } = cardsR

  const handleOpenOrderMyCard = () =>
    modalActions.showModal({ props: { origin: 'DebitCardPage' }, type: ModalName.ORDER_MY_CARD })

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
      {isLoading ? (
        <Loading />
      ) : cards.length === 0 ? (
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
