import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Icon, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import { Container } from './BankWireCard.styles'
import { BankWireCardComponent } from './BankWireCard.types'

export const BankWireCard: BankWireCardComponent = ({ onClick, text, value }) => {
  return (
    <Container data-e2e={`sb${value.type.toLowerCase()}BankWire`} onClick={onClick}>
      <Padding horizontal={24} vertical={28}>
        <Flex gap={16} flexDirection='column'>
          <Flex gap={8} justifyContent='space-between' alignItems='center'>
            <Text weight={600} size='16px' lineHeight='24px' color='grey800'>
              {text}
            </Text>

            <Icon name='chevron-right' size='24px' color='grey400' />
          </Flex>

          <Text weight={500} size='12px' lineHeight='16px'>
            <FormattedMessage
              id='paymentMethods.bankWire.message'
              defaultMessage="If you'd prefer to deposit funds directly from your bank account first, follow the instructions on the next screen. Once your deposit arrives in your Blockchain.com account you can come back here to buy crypto."
            />
          </Text>
        </Flex>
      </Padding>
    </Container>
  )
}
