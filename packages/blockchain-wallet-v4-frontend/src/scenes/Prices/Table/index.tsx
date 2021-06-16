import styled from 'styled-components'

import { Text } from 'blockchain-info-components'

import { getActionsColumn } from './actions.column'
import { getBalanceColumn } from './balance.column'
import { getNameColumn } from './name.column'
import { getPriceColumn } from './price.column'
import { getPriceChangeColumn } from './priceChange.column'

export const TableWrapper = styled.div`
  /* make table full page width */
  display: block;
  max-width: 100%;

  /* make the table scrollable when it gets too small */
  .tableWrap {
    display: block;
    max-width: 100%;
    overflow-x: scroll;
    overflow-y: hidden;
  }

  table {
    /* make sure the inner table is always as wide as needed */
    width: 100%;
    border-spacing: 0;
    border: 1px solid ${(props) => props.theme.grey100};
    border-radius: 8px;

    td {
      border-top: 1px solid ${(props) => props.theme.grey100};
    }

    th,
    td {
      margin: 0;
      padding: 16px 8px;
      text-align: left;
      /* make sure each cell grows equally */
      width: 1%;
    }
  }
`

export const CellHeaderText = styled(Text)`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.grey400};
`
export const CellText = styled(Text)`
  font-style: normal;
  font-weight: 500;
  font-size: ${(props) => (props.size ? props.size : '16px')};
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

export const getTableColumns = ({ modalActions, routerActions, walletCurrency }) => () => [
  getNameColumn(routerActions),
  getPriceColumn(walletCurrency),
  getPriceChangeColumn(),
  getBalanceColumn(),
  getActionsColumn(modalActions)
]
