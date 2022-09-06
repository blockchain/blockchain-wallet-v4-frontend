import styled from 'styled-components'

import { SpinningLoader } from 'blockchain-info-components'

export const ReportItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0;
`

export const Content = styled.div`
  display: flex;

  svg {
    margin-top: 4px;
  }
`

export const Description = styled.div`
  margin-left: 16px;
`

export const StyledLoading = styled(SpinningLoader)`
  margin-top: 4px;
`

export const EmptyReportList = styled.div`
  height: 1rem;
`
