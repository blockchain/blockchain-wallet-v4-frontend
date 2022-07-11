import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from '@blockchain-com/constellation'
import { IconBank, IconChevronRight } from '@blockchain-com/icons'

import { Text } from 'blockchain-info-components'
import { DisplayContainer } from 'components/BuySell'
import { Expanded, Flex } from 'components/Flex'
import { Padding } from 'components/Padding'

import { ArriveInThreeDaysEasyBankTransferCardComponent } from './ArriveInThreeDaysEasyBankTransferCard.types'

export const ArriveInThreeDaysEasyBankTransferCard: ArriveInThreeDaysEasyBankTransferCardComponent =
  ({ onClick }) => {
    const icon = (
      <Icon label='' color='blue600'>
        <IconBank />
      </Icon>
    )

    const body = (
      <Flex flexDirection='column' gap={4}>
        <Flex flexDirection='column'>
          <Text size='16px' lineHeight='24px' weight={600}>
            <FormattedMessage
              id='modals.simplebuy.instant_easy_bank_transfer.title'
              defaultMessage='Easy Bank Transfer '
            />
          </Text>
          <Text size='14px' lineHeight='20px' weight={500}>
            <FormattedMessage
              id='modals.simplebuy.instant_easy_bank_transfer.sub_title'
              defaultMessage='Should arrive in 3 business days'
            />
          </Text>
        </Flex>

        <Text size='12px' lineHeight='16px' weight={500} color='grey600'>
          <FormattedMessage
            id='modals.simplebuy.instant_easy_bank_transfer.content'
            defaultMessage='Quick and secure without entering account details.'
          />
        </Text>
      </Flex>
    )

    const chevronIcon = (
      <Padding top={4}>
        <Icon label='chevron-right' color='grey700' size='sm'>
          <IconChevronRight />
        </Icon>
      </Padding>
    )

    return (
      <DisplayContainer onClick={onClick}>
        <Expanded>
          <Flex gap={16}>
            {icon}

            <Expanded>{body}</Expanded>

            {chevronIcon}
          </Flex>
        </Expanded>
      </DisplayContainer>
    )
  }
