import React from 'react'
import { FormattedMessage } from 'react-intl'
import {
  Button,
  Flex,
  IconWarningTriangle,
  SemanticColors,
  Text
} from '@blockchain-com/constellation'

import { Wrapper } from './styles'
import { QuoteChangeProps } from './types'

export const QuoteChange = ({ setShowQuoteChangeMsg }: QuoteChangeProps) => (
  <Wrapper>
    <Flex alignItems='center' gap={16}>
      <IconWarningTriangle color={SemanticColors.warning} size='large' />
      <Text color={SemanticColors.title} variant='paragraph2'>
        <FormattedMessage
          defaultMessage='Price Updated'
          id='dex.confirm_swap.quote_change.price_updated'
        />
      </Text>
    </Flex>
    <Button
      size='default'
      variant='primary'
      onClick={() => setShowQuoteChangeMsg(false)}
      text={<FormattedMessage id='copy.accept' defaultMessage='Accept' />}
    />
  </Wrapper>
)
