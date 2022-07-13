import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon as ConstellationIcon } from '@blockchain-com/constellation'
import { IconArrowDown } from '@blockchain-com/icons'

import { Icon } from 'blockchain-info-components'
import { Description, DisplayContainer, DisplaySubTitle, DisplayTitle } from 'components/BuySell'
import { Expanded, Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import { IconContainer } from './SameDayBankTransferCard.styles'
import { SameDayBankTransferCardComponent } from './SameDayBankTransferCard.types'

export const SameDayBankTransferCard: SameDayBankTransferCardComponent = ({ onClick }) => {
  const icon = (
    <IconContainer>
      <ConstellationIcon label='bank-icon' color='blue600'>
        <IconArrowDown />
      </ConstellationIcon>
    </IconContainer>
  )

  const body = (
    <Flex flexDirection='column' gap={4}>
      <Flex flexDirection='column'>
        <DisplayTitle>
          <FormattedMessage
            id='modals.simplebuy.same_day_bank_transfer.title'
            defaultMessage='Bank Transfer'
          />
        </DisplayTitle>
        <DisplaySubTitle>
          <FormattedMessage
            id='modals.simplebuy.same_day_bank_transfer.sub_title'
            defaultMessage='Should arrive same day'
          />
        </DisplaySubTitle>
      </Flex>

      <Description>
        <FormattedMessage
          id='modals.simplebuy.same_day_bank_transfer.content'
          defaultMessage='Transfers are made through the UK Faster Payments System and usually arrive in seconds.'
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
