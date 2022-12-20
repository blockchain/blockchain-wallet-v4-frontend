import { SemanticColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

export const FaqItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 1px solid ${SemanticColors['background-light']};
  border-radius: 16px;

  &:hover {
    cursor: pointer;
  }
`
