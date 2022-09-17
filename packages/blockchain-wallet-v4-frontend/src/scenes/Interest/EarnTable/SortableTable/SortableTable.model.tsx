import {
  ButtonCellProps,
  PaletteColors,
  TableContainer as Table,
  TextCellProps
} from '@blockchain-com/constellation'
import { Row as ReactTableRowType } from '@tanstack/react-table'
import styled, { css } from 'styled-components'

export const TableContainer = styled(Table)`
  width: 100%;
  border-color: ${PaletteColors['grey-000']} !important;

  & > thead > tr {
    background-color: ${PaletteColors['grey-000']} !important;
  }
`

export type RowType = {
  actions: ButtonCellProps | TextCellProps
  asset: TextCellProps
  balance: TextCellProps
  rates: TextCellProps
}

export type CellProps = {
  value?: number | string
} & TextCellProps

const compareCells = ({ value: valueA }: CellProps, { value: valueB }: CellProps) => {
  if (typeof valueA === 'string' && typeof valueB === 'string') {
    return valueA.localeCompare(valueB)
  }
  if (typeof valueA === 'number' && typeof valueB === 'number') {
    return valueA - valueB
  }
  return `${valueA}`.localeCompare(`${valueB}`)
}

export const sortTextCells = (
  rowA: ReactTableRowType<RowType>,
  rowB: ReactTableRowType<RowType>,
  id: keyof RowType
) => {
  const cellAData = rowA.original[id as keyof RowType] as TextCellProps
  const cellBData = rowB.original[id as keyof RowType] as TextCellProps

  return compareCells(cellAData, cellBData)
}
