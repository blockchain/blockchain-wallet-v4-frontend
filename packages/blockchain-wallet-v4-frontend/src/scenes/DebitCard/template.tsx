import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Icon, Image } from 'blockchain-info-components'
import {
  HeaderTextWrapper,
  IconBackground,
  SceneHeader,
  SceneHeaderText,
  SceneSubHeaderText
} from 'components/Layout'
import { ModalName } from 'data/modals/types'

import { Props } from '.'
import { IntroCardWrapper, Wrapper } from './model'

type ButtonProps = {
  onClick: () => void
}

const OrderMyCardButton = ({ onClick }: ButtonProps) => (
  <div style={{ marginTop: '32px' }}>
    <Button
      data-e2e='orderMyCard'
      nature='primary'
      height='48px'
      width='327px'
      margin='auto'
      onClick={onClick}
    >
      <FormattedMessage id='scenes.debit_card.intro.order_my_card' defaultMessage='Order My Card' />
    </Button>
  </div>
)

const LinkHereButton = () => (
  <div style={{ marginTop: '16px' }}>
    <Button
      data-e2e='linkCard'
      nature='empty-blue'
      height='48px'
      width='327px'
      margin='auto'
      onClick={() => {}}
    >
      <FormattedMessage
        id='scenes.debit_card.intro.already_have_a_card'
        defaultMessage='Already Have A Card? Link It Here'
      />
    </Button>
  </div>
)

const DebitCard = ({ debitCardActions, modalActions }: Props) => {
  useEffect(() => {
    // Get available products that user can create
    debitCardActions.getProducts()
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
      <IntroCardWrapper>
        <Image name='intro-card' />

        <SceneHeaderText>
          <FormattedMessage
            id='scenes.debit_card.intro.content.header'
            defaultMessage='Your Gateway To The Blockchain Debit Card'
          />
        </SceneHeaderText>

        <SceneSubHeaderText>
          <FormattedMessage
            id='scenes.debit_card.intro.content.subheader'
            defaultMessage='A card that lets you spend and earn in crypto right from your Blockchain account.'
          />
        </SceneSubHeaderText>
        <OrderMyCardButton onClick={handleOpenOrderMyCard} />
        <LinkHereButton />
      </IntroCardWrapper>
    </Wrapper>
  )
}

export default DebitCard
