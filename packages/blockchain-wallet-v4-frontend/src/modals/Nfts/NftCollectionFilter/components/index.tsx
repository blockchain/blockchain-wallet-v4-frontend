import { colors } from '@blockchain-com/constellation'
import styled from 'styled-components'

import { Row } from 'components/Flyout'

export const StickyBuyNowRow = styled(Row)`
  background: ${colors.white1};
  position: sticky;
  top: 120px;
  z-index: 2;
`

export const StickyTraitHeader = styled.div`
  position: sticky;
  top: 194px;
  z-index: 1;
  padding: 16px 40px;
  background: ${colors.white1};
  border-bottom: 1px solid ${colors.grey100};
`

export const TraitList = styled.div`
  padding: 8px 40px;
  max-height: 200px;
  overflow: auto;
  border-bottom: 1px solid ${colors.grey100};
`
