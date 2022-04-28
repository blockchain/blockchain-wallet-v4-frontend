import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

export const Title = styled(Text)<{ asValue?: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.grey900};
  margin-top: ${(props) => (props.asValue ? '4px' : '0px')};
`
