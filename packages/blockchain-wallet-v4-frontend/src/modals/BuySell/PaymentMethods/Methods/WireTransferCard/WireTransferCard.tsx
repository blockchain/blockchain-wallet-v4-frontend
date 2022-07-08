import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon as ConstellationIcon } from '@blockchain-com/constellation'
import { IconArrowDown } from '@blockchain-com/icons'

import { Icon } from 'blockchain-info-components'
import { Description, DisplayContainer, DisplaySubTitle, DisplayTitle } from 'components/BuySell'
import { Expanded, Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import { IconContainer } from './WireTransferCard.styles'
import { WireTransferCardComponent } from './WireTransferCard.types'

export const WireTransferCard: WireTransferCardComponent = ({ onClick }) => {
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
            id='modals.simplebuy.wire_transfer.title'
            defaultMessage='Wire Transfer'
          />
        </DisplayTitle>
        <DisplaySubTitle>
          <FormattedMessage
            id='modals.simplebuy.wire_transfer.sub_title'
            defaultMessage='Should arrive in 3-5 business days '
          />
        </DisplaySubTitle>
      </Flex>

      <Description>
        <FormattedMessage
          id='modals.simplebuy.wire_transfer.content'
          defaultMessage='For transferring large amounts. Bank fees may apply.'
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
