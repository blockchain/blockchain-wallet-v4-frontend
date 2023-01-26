import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Flex, Padding, PaletteColors, SemanticColors, Text } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { model } from 'data'

const { ETHERSCAN_TOKEN_URL } = model.components.dex

const ButtonContainer = styled.button`
  width: 95px;
  border-radius: 4px;
  border: 2px solid ${() => PaletteColors['grey-050']};
`

const ChevronIcon = styled.div`
  box-sizing: border-box;
  position: relative;
  display: block;
  transform: scale(var(--ggs, 1));
  width: 7px;
  height: 7px;
  border: 1px solid transparent;
  border-radius: 100px;
  color: ${({ theme }) => theme.grey400};

  &::after {
    content: '';
    display: block;
    box-sizing: border-box;
    position: absolute;
    width: 7px;
    height: 7px;
    border-bottom: 1px solid;
    border-right: 1px solid;
    transform: rotate(-45deg);
    right: -8px;
    top: -1px;
  }
`

export const ViewEtherscan = ({ tokenAddress }: { tokenAddress: string }) => {
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
