import { SemanticColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${SemanticColors['background-light']};
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 24px;

  & > button {
    border-radius: 32px !important;
  }
`
