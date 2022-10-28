import { PaletteColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

export const CloseIconContainer = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${PaletteColors['grey-000']};
`
