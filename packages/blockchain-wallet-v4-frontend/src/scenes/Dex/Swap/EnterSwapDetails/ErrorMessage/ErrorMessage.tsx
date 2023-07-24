import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Padding, SemanticColors, Text } from '@blockchain-com/constellation'

import { ErrorMessageProps } from './types'

export const ErrorMessage = ({ coin, error, isInsufficientBalance }: ErrorMessageProps) => (
  <Padding vertical={1}>
    <Flex justifyContent='center'>
      <Text color={SemanticColors.warning} textAlign='center' variant='paragraph1'>
        {isInsufficientBalance ? (
          <FormattedMessage
            defaultMessage='Not enough {coin} to cover swap.'
            id='scene.dex.enter_swap_details.error.message'
            values={{ coin }}
          />
        ) : (
          error
        )}
      </Text>
    </Flex>
  </Padding>
)
