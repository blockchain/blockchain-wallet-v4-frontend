import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Padding, SemanticColors, Text } from '@blockchain-com/constellation'

import { model } from 'data'

import { ButtonContainer, ChevronIcon } from './styles'

const { ETHERSCAN_TOKEN_URL } = model.components.dex

const ViewEtherscan = ({ tokenAddress }: { tokenAddress: string }) => {
  const onClick = () => {
    window.open(`${ETHERSCAN_TOKEN_URL}/${tokenAddress}`, '_blank')
  }

  return (
    <ButtonContainer onClick={onClick}>
      <Padding vertical={0.2} left={0.5}>
        <Flex alignItems='center'>
          <Text variant='caption2' color={SemanticColors.muted}>
            <FormattedMessage id='dex.swap.viewOnEtherscan' defaultMessage='Etherscan' />
          </Text>
          <ChevronIcon />
        </Flex>
      </Padding>
    </ButtonContainer>
  )
}

export default ViewEtherscan
