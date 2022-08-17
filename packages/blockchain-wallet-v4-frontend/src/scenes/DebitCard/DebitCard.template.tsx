import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { SkeletonRectangle } from 'blockchain-info-components'
import { Container } from 'components/Box'
import { HeaderTextWrapper, SceneHeader, SceneHeaderText } from 'components/Layout'
import { selectors } from 'data'
import { ModalName } from 'data/modals/types'
import { useRemote } from 'hooks'

import CardDashboard from './CardDashboard'
import CardOrder from './CardOrder'
import { Props } from './DebitCard'
import { Wrapper } from './DebitCard.model'

const DebitCard = ({
  alertActions,
  cardToken,
  debitCardActions,
  domains,
  identityVerificationActions,
  lockHandler,
  modalActions,
  userData
}: Props) => {
  const { data: cards = [], isLoading } = useRemote(selectors.components.debitCard.getCards)

  const handleOpenOrderMyCard = () => {
    const currentTier = userData?.tiers?.current ?? 0

    if (currentTier === 2 || currentTier === 1) {
      // user in SDD but already completed eligibility check, continue to payment
      modalActions.showModal(ModalName.ORDER_MY_CARD, { origin: 'DebitCard' })
    } else {
      identityVerificationActions.verifyIdentity({
        onCompletionCallback: () => {
          modalActions.showModal(ModalName.ORDER_MY_CARD, { origin: 'DebitCard' })
        },
        origin: 'DebitCard',
        tier: 2
      })
    }
  }

  useEffect(() => {
    debitCardActions.getCards()
    return () => {
      debitCardActions.cleanCardData()
    }
  }, [debitCardActions])

  return (
    <Wrapper>
      <SceneHeader>
        <HeaderTextWrapper>
          <SceneHeaderText>
            <FormattedMessage id='copy.debit_card' defaultMessage='Blockchain.com Visa Card' />
          </SceneHeaderText>
        </HeaderTextWrapper>
      </SceneHeader>

      {isLoading ? (
        <Container>
          <SkeletonRectangle width='330px' height='270px' />
        </Container>
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
          userData={userData}
        />
      )}
    </Wrapper>
  )
}

export default DebitCard
