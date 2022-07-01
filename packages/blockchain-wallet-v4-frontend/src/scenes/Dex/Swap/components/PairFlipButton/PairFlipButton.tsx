import React from 'react'
import { Icon } from '@blockchain-com/constellation'
import { IconDeposit } from '@blockchain-com/icons'
import styled from 'styled-components'

const FlipPairButton = styled.div<{ animate: boolean }>`
  position: absolute;
  top: calc(50% - 16px);
  right: calc(50% - 16px);
  height: 32px;
  width: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.white};
  z-index: 99;
  cursor: pointer;

  > :nth-child(1) {
    position: relative;
    top: 8px;
    left: 8px;
    z-index: 99 !important;
    cursor: pointer;
  }

  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 6px;
    right: 6px;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background-color: ${(props) => props.theme.grey000};
  }
  &:hover:after {
    background-color: ${(props) => props.theme.grey100};
  }
`

const PairFlipButton = ({ animate, onFlipPairClick }: OwnProps) => (
  <FlipPairButton animate={animate} onClick={onFlipPairClick}>
    <Icon label='arrow down' color='grey400' size='sm'>
      <IconDeposit />
    </Icon>
  </FlipPairButton>
)

type OwnProps = {
  animate: boolean
  onFlipPairClick: () => void
}

export default PairFlipButton
