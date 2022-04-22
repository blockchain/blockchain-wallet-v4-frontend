import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

export const TableWrapper = styled.div`
  display: block;
  max-width: 100%;
  height: 100%;
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
    border: 1px solid ${(props) => props.theme.grey100};
    border-radius: 8px;

    .th {
      display: table-header-group;
    }

    .th,
    .td {
      padding: 16px;
      vertical-align: middle;
      display: table-cell;
      margin: 0;
      text-align: left;
      width: 20%;
    }

    .td {
      height: 75px;
      padding-top: 0;
      padding-bottom: 0;
    }

    .tr {
      border-top: 1px solid ${(props) => props.theme.grey100};
      display: table;
      width: 100%;
      &:first-child {
        border-top: 0px;
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
`
