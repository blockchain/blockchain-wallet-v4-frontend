import styled from 'styled-components'

import { Button } from 'blockchain-info-components'
import { SettingHeader } from 'components/Setting'
import { media } from 'services/styles'

export const CardWrapper = styled.div`
  display: flex;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  justify-content: space-between;
  border: 1px solid ${props => props.theme.grey000};
  cursor: pointer;
  width: 430px;

  ${media.mobile`
  width: 100%;
`}
`
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
  text-align: ${props => (props.right ? 'right' : 'initial')};
`
export const RemoveButton = styled(Button)`
  &:hover {
    border-color: ${props => props.theme.red400};
    background-color: transparent;
  }
`
