import styled from 'styled-components'

const SecurityTip = styled.div`
  border-left: 1px solid ${props => props.theme['gray-2']};
  border-right: 1px solid ${props => props.theme['gray-2']};
  border-bottom: 1px solid ${props => props.theme['gray-2']};
  padding: 20px;
  margin-top: 0px !important;
`

export default SecurityTip
