import { Button } from 'blockchain-info-components'
import styled from 'styled-components'

const AddNewButton = styled(Button)`
  padding: 8px 16px;
  margin: 0 auto;
  margin-top: 40px;
  margin-bottom: 40px;
  width: 83%;
  color: ${props => props.theme.blue600};
  border-color: ${props => props.theme.grey100};
`

export { AddNewButton }
