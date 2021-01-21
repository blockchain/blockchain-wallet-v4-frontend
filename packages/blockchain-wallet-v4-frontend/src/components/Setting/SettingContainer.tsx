import styled from 'styled-components'

import { media } from 'services/styles'

const SettingContainer = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 10px 0px;
  border-bottom: 1px solid ${props => props.theme.grey000};

  ${media.atLeastTabletL`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  `}
`

export default SettingContainer
