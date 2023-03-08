import { PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

export const Root = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${PaletteColors['blue-600']};
`

export const ProgressWrapper = styled.div`
  & > div {
    width: 16px;
    height: 16px;
  }

  svg {
    vertical-align: initial;
  }
`

export const Text = styled.span`
  color: ${PaletteColors['grey-900']};
  font-size: 12px;
  font-weight: 600;
`

export const Highlight = styled.span<{ isHighlighted: boolean }>`
  color: ${(props) => (props.isHighlighted ? PaletteColors['red-500'] : 'currentColor')};
  transition: color 200ms ease;
`
