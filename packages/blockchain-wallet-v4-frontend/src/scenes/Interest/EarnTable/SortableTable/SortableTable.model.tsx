import { PaletteColors, TableContainer as Table } from '@blockchain-com/constellation'
import { Row as ReactTableRowType } from '@tanstack/react-table'
import styled from 'styled-components'

import { CellProps, RowType } from './SortableTable.types'

export const TableContainer = styled(Table)`
  width: 100%;
  border-color: ${PaletteColors['grey-000']} !important;

  & > thead > tr {
    background-color: ${PaletteColors['grey-000']} !important;
  }
`

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
  const cellAData = rowA.original[id as keyof RowType] as CellProps
  const cellBData = rowB.original[id as keyof RowType] as CellProps

  return compareCells(cellAData, cellBData)
}
