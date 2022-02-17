import { colors } from '@blockchain-com/constellation'
import styled from 'styled-components'

export const StickyTraitHeader = styled.div`
  position: sticky;
  top: 120px;
  padding: 16px 40px;
  background: ${colors.white1};
  border-bottom: 1px solid ${colors.grey100};
`

export const TraitList = styled.div`
  padding: 4px 40px;
  max-height: 200px;
  overflow: auto;
  border-bottom: 1px solid ${colors.grey100};
`
