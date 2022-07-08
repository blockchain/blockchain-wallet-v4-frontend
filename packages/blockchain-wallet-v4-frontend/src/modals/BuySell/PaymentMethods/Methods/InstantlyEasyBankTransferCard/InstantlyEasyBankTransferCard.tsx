import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon as ConstellationIcon } from '@blockchain-com/constellation'
import { IconBank } from '@blockchain-com/icons'

import { Icon } from 'blockchain-info-components'
import { Description, DisplayContainer, DisplaySubTitle, DisplayTitle } from 'components/BuySell'
import { Expanded, Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import { IconContainer } from '../Methods.styles'
import { InstantlyEasyBankTransferCardComponent } from './InstantlyEasyBankTransferCard.types'

export const InstantlyEasyBankTransferCard: InstantlyEasyBankTransferCardComponent = ({
  onClick
}) => {
  const icon = (
    <IconContainer>
      <ConstellationIcon label='bank-icon' color='blue600'>
        <IconBank />
      </ConstellationIcon>
    </IconContainer>
  )

  const body = (
    <Flex flexDirection='column' gap={4}>
      <Flex flexDirection='column'>
        <DisplayTitle>
          <FormattedMessage
            id='modals.simplebuy.instant_easy_bank_transfer.title'
            defaultMessage='Easy Bank Transfer '
          />
        </DisplayTitle>
        <DisplaySubTitle>
          <FormattedMessage
            id='modals.simplebuy.instant_easy_bank_transfer.sub_title'
            defaultMessage='Should arrive instantly'
          />
        </DisplaySubTitle>
      </Flex>

      <Description>
        <FormattedMessage
          id='modals.simplebuy.instant_easy_bank_transfer.content'
          defaultMessage='Quick and secure without entering account details.'
        />
      </Description>
    </Flex>
  )

  const chevronIcon = (
    <Padding top={4}>
      <Icon name='chevron-right' size='24px' color='grey400' />
    </Padding>
  )

  return (
    <DisplayContainer onClick={onClick}>
      <Expanded>
        <Flex gap={16}>
          {icon}

          <Expanded>{body}</Expanded>

          <Flex alignItems='center'>{chevronIcon}</Flex>
        </Flex>
      </Expanded>
    </DisplayContainer>
  )
}
