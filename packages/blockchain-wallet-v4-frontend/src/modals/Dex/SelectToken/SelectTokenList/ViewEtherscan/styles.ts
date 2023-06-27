import { PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

export const ButtonContainer = styled.button`
  width: 95px;
  border-radius: 4px;
  border: 2px solid ${() => PaletteColors['grey-050']};
`

export const ChevronIcon = styled.div`
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
