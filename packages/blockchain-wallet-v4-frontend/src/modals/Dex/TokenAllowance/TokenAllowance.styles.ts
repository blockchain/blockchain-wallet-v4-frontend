import { SemanticColors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Icon } from 'blockchain-info-components'

export const CloseIcon = styled.div`
  > :first-child {
    cursor: pointer;
  }
`
export const EthIcon = styled(Icon)`
  width: 16px;
  height: 16px;
`
export const HorizontalLine = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${SemanticColors['background-light']};
`
