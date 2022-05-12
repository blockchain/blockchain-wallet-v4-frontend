import { LinkContainer } from 'react-router-bootstrap'
import { colors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

export const Highest = styled(Text)`
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 14px;
  color: ${colors.grey600};
`

export const EthText = styled(Highest)`
  font-size: 24px;
  display: flex;
  margin-bottom: 20px;
  align-items: center;
  color: ${colors.grey900};
`

export const CollectionName = styled(Text)`
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  color: ${colors.grey900};
`

export const CustomLink = styled(LinkContainer)`
  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`
