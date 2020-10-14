import { Form } from 'redux-form'
import { Text } from 'blockchain-info-components'
import styled from 'styled-components'

export const TopText = styled(Text)<{ spaceBetween: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${props =>
    props.spaceBetween ? 'space-between' : 'initial'};
  margin-bottom: 16px;
`
export const StyledForm = styled(Form)`
  margin-top: 36px;
`
export const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: ${props => `1px solid ${props.theme.grey000}`};
  padding: 16px 40px;
  cursor: pointer;
`
