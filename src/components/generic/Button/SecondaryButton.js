import styled from 'styled-components'

import Button from './Button'

const SecondaryButton = styled(Button)`
  background-color: #10ADE4;
  border: ${props => props.bordered ? '2px solid #FFFFFF' : '2px solid #10ADE4'};
  min-width: 130px;
  
  &:hover { background-color: #0E9BCC; } 
`

export default SecondaryButton
