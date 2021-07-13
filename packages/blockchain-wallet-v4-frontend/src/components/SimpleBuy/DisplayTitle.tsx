import styled from 'styled-components'

import { Title } from 'components/Flyout'

const DisplayTitle = styled(Title)`
  align-items: left;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  color: ${props => props.theme.textBlack};
  width: 100%;
`

export default DisplayTitle
