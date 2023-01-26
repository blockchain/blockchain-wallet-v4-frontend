import { TextCellProps } from '@blockchain-com/constellation'
import { Row as ReactTableRowType } from '@tanstack/react-table'

import { RowType } from './SortableTable.types'

const compareCells = ({ value: valueA }: TextCellProps, { value: valueB }: TextCellProps) => {
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
