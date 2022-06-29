import styled from 'styled-components'

import { Text } from 'blockchain-info-components'
import { media } from 'services/styles'

export const TableWrapper = styled.div<{
  cellWidth?: string
  height?: string
  minCellWidth?: string
}>`
  display: block;
  max-width: 100%;
  height: ${(props) => props.height || '100%'};
  width: 100%;

  .tableWrap {
    display: block;
    max-width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
  }

  .table {
    display: block;
    height: 100%;
    border-spacing: 0;
    ${media.atLeastTablet`
      border: 1px solid ${(props) => props.theme.grey100};
      border-radius: 8px;
  `}

    .th {
      display: table-header-group;
    }

    .tbody {
      overflow: scroll;
    }

    .th,
    .td {
      padding: 16px;
      vertical-align: middle;
      display: table-cell;
      margin: 0;
      text-align: left;
      min-width: ${(props) => (props.minCellWidth ? props.minCellWidth : '50px')};
      width: ${(props) => (props.cellWidth ? props.cellWidth : '20%')};

      ${media.tabletL`
        max-width: 12em;
        min-width: 12em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `}
    }

    .td {
      height: 75px;
      padding-top: 0;
      padding-bottom: 0;
      ${media.tabletL`
        height: 66px;
      `}
    }

    .tr {
      border-top: 1px solid ${(props) => props.theme.grey100};
      display: table;
      width: 100%;
      &:first-child {
        border-top: 0;
      }
    }
  }
`
export const StickyTableHeader = styled.div`
  position: sticky;
  top: 0;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  border-bottom: 1px solid ${(props) => props.theme.grey100};
  background: ${(props) => props.theme.white};
  z-index: 1;
`

export const StickyColumn = styled.div`
  position: sticky;
  left: 0;
  z-index: 0;
  background-color: white;
  ${media.mobile`
    border-right: 1px solid ${(props) => props.theme.grey100};
  `}
`

export const CellHeaderText = styled(Text)`
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.grey500};
`
export const CellText = styled(Text)`
  font-style: normal;
  font-weight: 600;
  font-size: ${(props) => (props.size ? props.size : '14px')};
  line-height: 24px;
  color: ${(props) => (props.color ? props.color : props.theme.grey900)};
`
export const HeaderText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`
export const HeaderToggle = styled.span`
  color: ${(props) => props.theme.grey500};
  margin-left: 4px;
`
