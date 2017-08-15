import styled from 'styled-components'

import Button from './Button'

const PrimaryButton = styled(Button)`
  background-color: #004A7C;
  border: ${props => props.bordered ? '2px solid #FFFFFF' : '2px solid #004A7C'};
  min-width: 130px;
  
  &:hover { background-color: #153A62; } 
`
export default PrimaryButton
