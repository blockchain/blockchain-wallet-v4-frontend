import SecurityComponent from './SecurityComponent'
import SecurityContainer from './SecurityContainer'
import SecurityDescription from './SecurityDescription'
import SecurityHeader from './SecurityHeader'
import SecurityIcon from './SecurityIcon'
import SecuritySummary from './SecuritySummary'

import styled from 'styled-components'

export const SecurityTip = styled.div`
  border-left: 1px solid #cccccc;
  border-right: 1px solid #cccccc;
  border-bottom: 1px solid #cccccc;
  padding: 20px;
  width: 95%;
  margin-top: 0px !important;
`
const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export {
  SecurityComponent,
  SecurityContainer,
  SecurityDescription,
  SecurityHeader,
  SecurityIcon,
  SecuritySummary,
  IconContainer
}
