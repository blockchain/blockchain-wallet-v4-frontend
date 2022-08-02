import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

const CardOrderHeader = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
`

const CardOrderSubHeader = styled(Text)`
  color: ${(props) => props.theme.grey900};
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
`

const CardOrderNote = styled(Text)`
  color: ${(props) => props.theme.grey400};
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 2rem;
`

const CardOrderDisclaimer = styled(Text)`
  color: ${(props) => props.theme.grey400};
  font-size: 0.75rem;
  font-weight: 400;
  margin-top: 2rem;
`

export { CardOrderDisclaimer, CardOrderHeader, CardOrderNote, CardOrderSubHeader }
