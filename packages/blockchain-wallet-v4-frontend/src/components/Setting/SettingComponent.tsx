import styled from 'styled-components'

import { media } from 'services/styles'

const SettingComponent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 1rem 0;
  box-sizing: border-box;

  ${media.atLeastTabletL`
    align-items: flex-end;
  `}
`

export default SettingComponent
