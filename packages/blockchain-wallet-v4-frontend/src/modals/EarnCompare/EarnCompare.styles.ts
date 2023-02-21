import { SemanticColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Modal } from 'blockchain-info-components'

export const CustomModal = styled(Modal)`
  width: 100%;
  max-width: 1087px;
  margin: 32px;
  padding: 24px;
`
export const TableContainer = styled.div`
  padding: 24px;
  border: 1px solid ${SemanticColors['background-light']};
  border-radius: 16px;
  box-shadow: 0px 4px 16px rgba(5, 24, 61, 0.08);
`
export const CloseContainer = styled.div`
  cursor: pointer;
`
