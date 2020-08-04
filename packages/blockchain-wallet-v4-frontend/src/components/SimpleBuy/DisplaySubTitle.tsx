import { Title } from 'components/Flyout'
import styled from 'styled-components'

const DisplaySubTitle = styled(Title)`
  align-items: left;
  font-weight: 500;
  font-size: 14px;
  color: ${props => props.theme.grey600};
  width: 100%;
`

export default DisplaySubTitle
