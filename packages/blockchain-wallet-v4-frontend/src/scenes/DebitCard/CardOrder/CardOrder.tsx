import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Button, Image } from 'blockchain-info-components'

import { IntroCardWrapper } from '../DebitCard.model'
import {
  CardOrderDisclaimer,
  CardOrderHeader,
  CardOrderNote,
  CardOrderSubHeader
} from './CardOrder.model'

const CardOrder = ({ handleOpenOrderCard }: { handleOpenOrderCard: () => void }) => (
  <IntroCardWrapper>
    <Image name='intro-card' />

    <CardOrderHeader>
      <FormattedMessage
        id='scenes.debit_card.intro.content.header'
        defaultMessage='Get the Blockchain.com Visa® Card'
      />
    </CardOrderHeader>

    <CardOrderSubHeader>
      <FormattedMessage
        id='scenes.debit_card.intro.content.subheader'
        defaultMessage='Spend your crypto or cash without fees. Earn 1% back in crypto.'
      />
    </CardOrderSubHeader>

    <CardOrderNote>
      <FormattedMessage
        id='scenes.debit_card.intro.content.note'
        defaultMessage='*This optional offer is not a Pathward product or service nor does Pathward endorse this offer.'
      />
    </CardOrderNote>

    <Button
      data-e2e='orderMyCard'
      nature='primary'
      height='48px'
      fullwidth
      onClick={handleOpenOrderCard}
    >
      <FormattedMessage id='scenes.debit_card.intro.order_my_card' defaultMessage='Order My Card' />
    </Button>

    <CardOrderDisclaimer>
      <FormattedMessage
        id='scenes.debit_card.intro.content.disclaimer'
        defaultMessage='This Blockchain.com Visa® Card is issued by Pathward, N.A., Member FDIC, pursuant to a license from Visa U.S.A. Inc. Blockchain.com Visa card can be used everywhere Visa debit cards are accepted.'
      />
    </CardOrderDisclaimer>
  </IntroCardWrapper>
)

export default CardOrder
