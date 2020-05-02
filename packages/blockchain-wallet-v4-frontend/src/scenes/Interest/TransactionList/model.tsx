import styled from 'styled-components'

import { GreyCartridge } from 'components/Cartridge'
import { Text } from 'blockchain-info-components'

// same style for all children
export const Value = styled(Text)<{ size?: string }>`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  color: ${props => props.theme.grey600};
  line-height: 1.5;
  * {
    font-size: 14px !important;
    font-weight: 500 !important;
    color: ${props => props.theme.grey600} !important;
  }
`

export const IconBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  min-width: 32px;
  background-color: ${props => props.theme.orange000};
  border-radius: 32px;
`

export const PendingTag = styled(GreyCartridge)`
  font-size: 12px;
  margin-left: 8px;
`
