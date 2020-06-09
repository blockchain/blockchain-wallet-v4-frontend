import styled from 'styled-components'

import media from 'services/ResponsiveService'

const SecurityHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: ${props => props.theme.grey700};
  width: 100%;
  ${media.atLeastMobile`
  font-size: 16px;
  `}

  & > * {
    margin-right: 10px;
  }
`

export default SecurityHeader
