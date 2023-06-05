import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, SemanticColors, Text } from '@blockchain-com/constellation'

import { Image } from 'blockchain-info-components'

import { TextWrapper, Wrapper } from './styles'

const CompleteSwap = ({ baseToken, counterToken, goToEnterDetails, onViewExplorer }) => (
  <Wrapper>
    <Image name='dex-swap-confirming' height='88px' width='88px' />
    <TextWrapper>
      <Text variant='title3' color={SemanticColors.title}>
        <FormattedMessage
          defaultMessage='Swapping {baseToken} for {counterToken}'
          id='dex.complete-swap.title'
          values={{ baseToken, counterToken }}
        />
      </Text>
      <Text variant='body1' color={SemanticColors.body}>
        <FormattedMessage
          defaultMessage='You swap is being confirmed by the network. Track the confirmation on Etherscan or feel free to start a new swap.'
          id='dex.complete-swap.description'
        />
      </Text>
    </TextWrapper>
    <Button
      onClick={onViewExplorer}
      size='default'
      text={
        <FormattedMessage
          defaultMessage='View on Etherscan'
          id='dex.complete-swap.etherscan-button'
        />
      }
      variant='minimal'
      width='full'
    />
    <Button
      onClick={goToEnterDetails}
      size='default'
      text={<FormattedMessage defaultMessage='New Swap' id='copy.new-swap' />}
      variant='primary'
      width='full'
    />
  </Wrapper>
)

export default CompleteSwap
