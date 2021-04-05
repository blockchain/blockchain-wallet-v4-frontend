import styled from 'styled-components'

import { Button } from 'blockchain-info-components'

const AddNewButton = styled(Button)`
  padding: 8px 16px;
  margin: 40px auto;
  width: 83%;
  color: ${props => props.theme.blue600};
  border-color: ${props => props.theme.grey100};
`

export { AddNewButton }
