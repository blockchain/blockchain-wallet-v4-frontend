import styled from 'styled-components'

import { Title } from 'components/Flyout'

const DisplaySubTitle = styled(Title)`
  align-items: left;
  font-weight: 500;
  font-size: 14px;
  color: ${(props) => props.theme.grey900};
  line-height: 21px;
  margin-top: 3px;
  width: 100%;
`

export default DisplaySubTitle
