import styled from 'styled-components'

import { Title } from 'components/Flyout'

const Description = styled(Title)`
  align-items: left;
  font-weight: 500;
  font-size: 12px;
  color: ${props => props.theme.grey600};
  width: 100%;
  line-height: 21px;
`

export { Description }
