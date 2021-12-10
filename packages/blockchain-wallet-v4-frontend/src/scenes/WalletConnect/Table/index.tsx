import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

import { getActionsColumn } from './actions.column'
import { getLinkColumn } from './link.column'
import { getNameColumn } from './name.column'
import { getWalletColumn } from './wallet.column'

export const TableWrapper = styled.div`
  display: block;
  max-width: 100%;

  .tableWrap {
    display: block;
    max-width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
  }

  .table {
    display: block;
    width: calc(100% - 1px);
    border-spacing: 0;
    border: 1px solid ${(props) => props.theme.grey100};
    border-radius: 8px;

    .th {
      display: table-header-group;
      padding: 16px 8px;
    }

    .th,
    .td {
      vertical-align: middle;
      display: table-cell;
      margin: 0;
      text-align: left;
      width: 20%;
    }

    .td {
      border-top: 1px solid ${(props) => props.theme.grey100};
      height: 75px;
      padding: 0;
    }

    .tr {
      display: table;
      width: 100%;
    }
  }
`

export const CellHeaderText = styled(Text)`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  color: ${(props) => props.theme.black};
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

  > :last-child {
    margin-left: 8px;
    margin-top: -2px;
  }
`

export const getTableColumns = ({ modalActions, walletConnectActions }) => [
  getNameColumn(),
  getLinkColumn(),
  getWalletColumn(),
  getActionsColumn(modalActions, walletConnectActions)
]
