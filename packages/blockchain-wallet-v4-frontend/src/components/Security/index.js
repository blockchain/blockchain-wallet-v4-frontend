import SecurityComponent from './SecurityComponent'
import SecurityContainer from './SecurityContainer'
import SecurityDescription from './SecurityDescription'
import SecurityHeader from './SecurityHeader'
import SecurityIcon from './SecurityIcon'
import SecuritySection from './SecuritySection'
import SecuritySummary from './SecuritySummary'
import SecurityWrapper from './SecurityWrapper'

import styled from 'styled-components'

const SuccessOverlay = styled.div`
  width: 90%;
  padding: 0px 20px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: ${props => props.success ? 'flex' : 'none'};
  position: absolute;
  left: 0px;
  z-index: 1;
`

export { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySection, SecuritySummary, SecurityWrapper, SuccessOverlay }
