import { triangle } from 'polished'
import styled from 'styled-components'

import { MenuItem } from 'layouts/Wallet/components'
import { media } from 'services/styles'

export const DropdownMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 50px;
  right: 0;
  z-index: 4;
  padding: 8px;
  border-radius: 4px;
  background: ${props => props.theme.white};
  box-shadow: 0px 0px 16px rgba(18, 29, 51, 0.25);
  ${media.laptopM`
    right: -8px;
  `}
`
export const DropdownMenuItem = styled(MenuItem)`
  white-space: nowrap;
  padding: 8px 16px;
  margin-bottom: 0;
`
export const DropdownMenuArrow = styled.div`
  position: absolute;
  top: -8px;
  right: 8px;
  ${props => {
    return triangle({
      pointingDirection: 'top',
      width: '16px',
      height: '8px',
      foregroundColor: props.theme.white
    })
  }}
`
