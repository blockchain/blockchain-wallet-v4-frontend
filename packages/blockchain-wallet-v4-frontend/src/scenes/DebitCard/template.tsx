import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Image } from 'blockchain-info-components'
import {
  HeaderTextWrapper,
  IconBackground,
  SceneHeader,
  SceneHeaderText,
  SceneSubHeaderText
} from 'components/Layout'

const Wrapper = styled.div`
  width: 100%;
`

const IntroCardWrapper = styled.div`
  text-align: center;
  margin: auto;
  width: 393px;
`

const OrderMyCardBtn = () => (
  <div style={{ marginTop: '32px' }}>
    <Button
      data-e2e='orderMyCard'
      nature='primary'
      height='48px'
      width='327px'
      margin='auto'
      onClick={() => {}}
    >
      <FormattedMessage id='scenes.debit_card.intro.order_my_card' defaultMessage='Order My Card' />
    </Button>
  </div>
)

const LinkHereBtn = () => (
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

const DebitCard = () => (
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

      <OrderMyCardBtn />
      <LinkHereBtn />
    </IntroCardWrapper>
  </Wrapper>
)

export default DebitCard
