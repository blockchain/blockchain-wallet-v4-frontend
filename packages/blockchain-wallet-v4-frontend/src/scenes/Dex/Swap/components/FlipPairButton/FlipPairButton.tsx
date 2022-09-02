import React from 'react'
import { IconDeposit, PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

const Wrapper = styled.div<{ quoteLocked?: boolean }>`
  position: absolute;
  top: calc(50% - 16px);
  right: calc(50% - 16px);
  height: 32px;
  width: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.white};
  z-index: 99;
  cursor: ${({ quoteLocked }) => (quoteLocked ? 'not-allowed' : 'pointer')};

  > :nth-child(1) {
    position: relative;
    top: 8px;
    left: 8px;
    z-index: 99 !important;
    cursor: ${({ quoteLocked }) => (quoteLocked ? 'not-allowed' : 'pointer')};
    transition: 0.45s;
  }

  > :hover:nth-child(1) {
    transform: ${({ quoteLocked }) => (quoteLocked ? 'none' : 'rotate(180deg)')};
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
`

const FlipPairButton = ({ onFlipPairClick, quoteLocked }: OwnProps) => (
  <Wrapper onClick={onFlipPairClick} quoteLocked={quoteLocked}>
    <IconDeposit color={PaletteColors['blue-600']} label='arrow down' size='small' />
  </Wrapper>
)

type OwnProps = {
  onFlipPairClick?: () => void
  quoteLocked?: boolean
}

export default FlipPairButton
