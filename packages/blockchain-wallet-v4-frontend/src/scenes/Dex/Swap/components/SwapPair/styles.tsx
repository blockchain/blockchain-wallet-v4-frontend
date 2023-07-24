import React from 'react'
import { Flex } from '@blockchain-com/constellation'
import styled from 'styled-components'

import NumberBox from 'components/Form/NumberBox'
import { DexSwapSide } from 'data/types'

import * as animations from './SwapPair.animations'

export const PairWrapper = styled.div<{ animate: boolean; swapSide: DexSwapSide }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 8px 16px;
  gap: 16px;

  height: 48px;
  background-color: ${(props) => props.theme.grey000};
  border-radius: 16px;

  & > div {
    max-width: 336px;
  }

  ${({ animate, swapSide }) =>
    swapSide === DexSwapSide.BASE
      ? animate
        ? animations.swingOutBottomAnimation
        : animations.swingInBottomAnimation
      : animate
      ? animations.swingOutTopAnimation
      : animations.swingInTopAnimation}
`
export const TokenSelectWrapper = styled.div<{ isQuoteLocked: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 6px 8px;

  width: 100px;
  border-radius: 10px;
  background-color: ${(props) => props.theme.white};
  cursor: ${({ isQuoteLocked }) => (isQuoteLocked ? 'not-allowed' : 'pointer')};
`
export const AmountInput = styled(NumberBox)`
  max-height: 24px;
  > input {
    background-color: initial;
    border: none;
    color: ${(props) => props.theme.textBlack};
    line-height: 135%;
    font-size: 24px;
    font-weight: 600;
    min-height: 24px;
    height: 24px;
    max-height: 24px;
    padding: 0;
    &:focus {
      background-color: initial;
      border: none;
    }
    ::placeholder {
      color: ${(props) => props.theme.textBlack};
      line-height: 200%;
      font-size: 24px;
      font-weight: 600;
    }
  }
`
export const SubtextContainer = styled.div`
  display: flex;
  max-width: 336px;
  overflow-x: scroll;
`
const TokenSelectRowStyled = styled(Flex)`
  margin-left: 8px;
`

export const TokenSelectRow = ({ children }: React.ComponentProps<typeof TokenSelectRowStyled>) => (
  <TokenSelectRowStyled alignItems='center' justifyContent='space-between' width='fill'>
    {children}
  </TokenSelectRowStyled>
)
