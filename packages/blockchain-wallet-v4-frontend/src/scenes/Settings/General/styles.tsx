import styled from 'styled-components'

import { Button } from 'blockchain-info-components'
import { SettingHeader } from 'components/Setting'

export const CustomSettingHeader = styled(SettingHeader)`
  margin-bottom: 18px;
`
export const Child = styled.div`
  display: flex;
  div:last-child {
    margin-top: 4px;
  }
`
export const CardDetails = styled.div<{ right?: boolean }>`
  text-align: ${(props) => (props.right ? 'right' : 'initial')};
`
export const RemoveButton = styled(Button)`
  &:hover {
    border-color: ${(props) => props.theme.red400};
    background-color: transparent;
  }
`
