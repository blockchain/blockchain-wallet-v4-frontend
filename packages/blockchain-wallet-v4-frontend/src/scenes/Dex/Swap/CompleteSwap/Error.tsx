import React, { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, SemanticColors, Text } from '@blockchain-com/constellation'

import { Image } from 'blockchain-info-components'

import { TextWrapper, Wrapper } from './styles'
import { FailSwapProps } from './types'

const Error = ({ goToConfirmSwap, goToEnterDetails, onDexSwapFailViewed }: FailSwapProps) => {
  useEffect(() => {
    onDexSwapFailViewed()
  }, [])
  return (
    <Wrapper>
      <Image name='dex-swap-error' height='88px' width='88px' />
      <TextWrapper>
        <Text color={SemanticColors.title} textAlign='center' variant='title3'>
          <FormattedMessage defaultMessage='Swap failed' id='dex.complete-swap.error.title' />
        </Text>
        <Text color={SemanticColors.body} textAlign='center' variant='body1'>
          <FormattedMessage
            defaultMessage="Your balance hasn't been affected. You can try again or cancel."
            id='dex.complete-swap.error.description'
          />
        </Text>
      </TextWrapper>
      <Button
        onClick={goToEnterDetails}
        size='default'
        text={<FormattedMessage defaultMessage='Cancel' id='copy.cancel' />}
        variant='minimal'
        width='full'
      />
      <Button
        onClick={goToConfirmSwap}
        size='default'
        text={<FormattedMessage defaultMessage='Try again' id='copy.try-again' />}
        variant='primary'
        width='full'
      />
    </Wrapper>
  )
}

export default Error
