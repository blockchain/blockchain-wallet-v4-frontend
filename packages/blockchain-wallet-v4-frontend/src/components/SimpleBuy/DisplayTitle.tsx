import { Title } from 'components/Flyout'
import styled from 'styled-components'

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
