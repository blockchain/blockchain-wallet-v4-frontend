import { SemanticColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 16px;
  border: 1px solid ${SemanticColors['background-light']};
  overflow: hidden;
`
