import styled from 'styled-components'

import { TableHeader } from 'blockchain-info-components'
import { Row } from 'components/Flyout'

export const StickyTableHeader = styled(TableHeader)`
  background: ${(props) => props.theme.white};
  position: sticky;
  top: 0;
`

export const StickyCTA = styled.div`
  background: ${(props) => props.theme.white};
  border-top: 1px solid ${(props) => props.theme.grey000};
  position: sticky;
  padding: 20px 40px;
  flex-direction: column;
  display: flex;
  bottom: 0;
  left: 0;
`

export const NftFlyoutRow = styled(Row)`
  padding-top: 8px;
  padding-bottom: 8px;
  border: 0px;
  &:last-child {
    border: 0px;
  }
`

export const CTARow = styled(Row)`
  padding-left: 0px;
  padding-right: 0px;
  &:first-child {
    padding-top: 0px;
    border-top: 0;
  }
`

export const RightAlign = styled.div`
  > div {
    justify-content: flex-end;
  }
`
