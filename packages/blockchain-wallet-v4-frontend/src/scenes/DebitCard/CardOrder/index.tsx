import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Image } from 'blockchain-info-components'
import { SceneHeaderText, SceneSubHeaderText } from 'components/Layout'

import { IntroCardWrapper } from '../model'

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

type Props = {
  handleOpenOrderMyCard: () => void
}

const CardOrder = ({ handleOpenOrderMyCard }: Props) => (
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
    {/*
          Waiting for UX designs
          <LinkHereButton />
     */}
  </IntroCardWrapper>
)

export default CardOrder
