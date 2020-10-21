import { Form } from 'redux-form'
import { Text } from 'blockchain-info-components'
import styled from 'styled-components'

export const TopText = styled(Text)<{
  marginBottom?: boolean
  spaceBetween: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: ${props =>
    props.spaceBetween ? 'space-between' : 'initial'};
  margin-bottom: ${props => (props.marginBottom ? '16px' : '0px')};
`
export const StyledForm = styled(Form)<{ marginTop?: boolean }>`
  margin-top: ${props => (props.marginTop ? '36px' : '0px')};
`
export const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: ${props => `1px solid ${props.theme.grey000}`};
  padding: 16px 40px;
  cursor: pointer;
`

export const IconBackground = styled.div<{ color: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 24px;
  z-index: 100;
  background: ${props => props.theme[props.color]};
`
