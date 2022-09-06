import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button, CheckBoxInput, Color, Image, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import {
  FlyoutContainer,
  FlyoutContent,
  FlyoutFooter,
  FlyoutHeader
} from 'components/Flyout/Layout'

import { ResultWrapper } from '../../DebitCard.model'
import { SubTextWrapper } from '../OrderCard.model'

type Props = {
  handleClose: () => void
  handleCreateCard: () => void
}

const CheckboxWrapper = styled(Flex)<{ termsAccepted: boolean }>`
  background: ${(props) =>
    props.termsAccepted ? PaletteColors['white-900'] : Color('greyFade000')};
  border: 1px solid ${PaletteColors['grey-000']};
  border-radius: 0.5rem;
  margin: 1rem 0em;
  justify-content: center;
  padding: 1rem;
`

const NotAsked = ({ handleClose, handleCreateCard }: Props) => {
  const [termsAccepted, setTermsAccepted] = useState(false)

  const toggleTermsAccepted = () => {
    setTermsAccepted((termsAccepted) => !termsAccepted)
  }

  return (
    <FlyoutContainer>
      <FlyoutHeader data-e2e='orderMyCardHeader' mode='close' onClick={handleClose}>
        <FormattedMessage
          id='modals.order_my_card.select_your_card.title'
          defaultMessage='Select Your Card'
        />
      </FlyoutHeader>
      <FlyoutContent mode='middle'>
        <ResultWrapper>
          <Image name='order-my-card' />
          <Text size='32px' weight={600} color='grey800'>
            <FormattedMessage
              id='modals.order_my_card.select_your_card.subtitle'
              defaultMessage='Virtual'
            />
          </Text>
          <SubTextWrapper>
            <FormattedMessage
              id='modals.order_my_card.select_your_card.content'
              defaultMessage='Our digital only card, use instantly for online payments.'
            />
          </SubTextWrapper>
        </ResultWrapper>
      </FlyoutContent>
      <FlyoutFooter collapsed>
        <CheckboxWrapper termsAccepted={termsAccepted}>
          <Flex alignItems='center' justifyContent='center'>
            <CheckBoxInput
              name='terms'
              disabled={false}
              onChange={toggleTermsAccepted}
              checked={termsAccepted}
            />
          </Flex>

          <Text color={PaletteColors['grey-200']} weight={500} size='12px'>
            <FormattedMessage
              id='modals.order_my_card.terms_of_service'
              defaultMessage='I understand and accept the terms and conditions of the Blockchain.com Visa Card Program, the Pathward Bank Cardholder Agreement, the Pathward Bank E-Sign Agreement and the Pathward Bank Privacy Policy. I also understand and accept that these terms operate in addition to the Blockchain.com Terms of Service and Blockchain.com Privacy Policy.'
            />
          </Text>
        </CheckboxWrapper>

        <Button
          data-e2e='createCardBtn'
          fullwidth
          nature='primary'
          height='48px'
          size='16px'
          onClick={handleCreateCard}
          disabled={!termsAccepted}
        >
          <FormattedMessage
            id='modals.order_my_card.select_your_card.create_card'
            defaultMessage='Create Card'
          />
        </Button>
      </FlyoutFooter>
    </FlyoutContainer>
  )
}

export default NotAsked
