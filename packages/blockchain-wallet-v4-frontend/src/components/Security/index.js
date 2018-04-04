import SecurityComponent from './SecurityComponent'
import SecurityContainer from './SecurityContainer'
import SecurityDescription from './SecurityDescription'
import SecurityHeader from './SecurityHeader'
import SecurityIcon from './SecurityIcon'
import SecuritySection from './SecuritySection'
import SecuritySummary from './SecuritySummary'
import SecurityWrapper from './SecurityWrapper'

import styled from 'styled-components'

export const SuccessOverlay = styled.div`
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
export const SecurityTip = styled.div`
  border-left: 1px solid #CCCCCC;
  border-right: 1px solid #CCCCCC;
  border-bottom: 1px solid #CCCCCC;
  padding: 20px;
  width: 95%;
`
const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export { SecurityComponent, SecurityContainer, SecurityDescription, SecurityHeader, SecurityIcon, SecuritySection, SecuritySummary, SecurityWrapper, IconContainer }
