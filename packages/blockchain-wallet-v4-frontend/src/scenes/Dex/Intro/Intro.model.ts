import styled from 'styled-components'

import { Button } from 'blockchain-info-components'

import { FormContainerCss } from '../Dex.model'

export const Wrapper = styled.div`
  ${FormContainerCss}
`
export const StepBubble = styled.div<{ active?: boolean }>`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? props.theme.blue600 : props.theme.grey100)};
  margin: 0 5px;
  cursor: pointer;
`
export const StepBubblesWrapper = styled.div`
  display: flex;
  flex-direction: row;
`
export const IntroWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4px 64px 0;
  text-align: center;
  height: 96px;
`
export const IntroStepWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0;
`
export const StyledIconButton = styled(Button)`
  border: none;
  min-width: fit-content;
  padding: 0;

  &:not(:disabled) > svg:hover {
    fill: ${({ theme }) => theme.blue800};
  }
`

export const steps = {
  0: {
    imageName: 'nft-img-placeholder',
    subtitle:
      'A decentralized exchange (DEX) is a peer-to-peer marketplace that lets you swap cryptocurrencies.',
    title: 'Welcome to the DEX'
  },
  1: {
    imageName: 'nft-img-placeholder',
    subtitle: 'Swap BTC, ETH, USDT, and more.',
    title: 'Swap 1000+ Tokens'
  },
  2: {
    imageName: 'nft-img-placeholder',
    subtitle:
      'When you trade on a DEX, you keep access to your private keys––it’s “your keys, your crypto.” Blockchain.com doesn’t hold these funds.',
    title: 'Keep control of your funds'
  }
}
