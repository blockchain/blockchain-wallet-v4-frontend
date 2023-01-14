import { PaletteColors, SemanticColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Button } from 'blockchain-info-components'

export const MessageContainer = styled.div<{ $borderColor: string }>`
  display: flex;
  padding: 16px;
  border: 1px solid ${({ $borderColor }) => SemanticColors[$borderColor]};
  border-radius: 16px;
  gap: 16px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`
export const SubmitButton = styled(Button)`
  border-color: ${SemanticColors.medium};

  &:hover {
    background-color: ${PaletteColors['blue-000']};
    border-color: ${SemanticColors.primary};
  }
`
