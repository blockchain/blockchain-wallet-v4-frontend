import {
  ButtonCellProps,
  PaletteColors,
  TableContainer as Table,
  TextCellProps
} from '@blockchain-com/constellation'
import { Row as ReactTableRowType } from '@tanstack/react-table'
import styled, { css } from 'styled-components'

const ProductContainerCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
`

export const TableContainer = styled(Table)`
  width: 100%;
  border-color: ${PaletteColors['grey-000']} !important;

  & > thead > tr {
    background-color: ${PaletteColors['grey-000']} !important;
  }
`
export const RewardsTextContainer = styled.div`
  ${ProductContainerCss}
  border: 1px solid ${PaletteColors['grey-100']};
`
export const StakingTextContainer = styled.div`
  ${ProductContainerCss}
  background-color: ${PaletteColors['grey-100']};
`

export type RowType = {
  actions: ButtonCellProps | TextCellProps
  asset: TextCellProps
  balance: TextCellProps
  rates: TextCellProps
}

const compareTextCells = (cellA: TextCellProps, cellB: TextCellProps) =>
  `${cellA.text}${cellA.subtext}`.localeCompare(`${cellB.text}${cellB.subtext}`)

const compareApyCells = (cellA: TextCellProps, cellB: TextCellProps) => {
  if (typeof cellA.text === 'string' && typeof cellB.text === 'string') {
    return Number(cellA.text.split('%')[0]) - Number(cellB?.text.split('%')[0])
  }
}
const getNodeText = (node) => node.props.children
const compareBalanceCells = (cellA: TextCellProps, cellB: TextCellProps) => {
  if (typeof cellA.text === 'object' && typeof cellB.text === 'object') {
    const textA = getNodeText(cellA.text)
    const textB = getNodeText(cellB.text)

    return Number(textA) - Number(textB)
  }
}

const compareCells = (cellA: TextCellProps, cellB: TextCellProps, id: string) => {
  switch (id) {
    case 'balance':
      return compareBalanceCells(cellA, cellB)
    case 'apy':
      return compareApyCells(cellA, cellB)

    default:
      return compareTextCells(cellA, cellB)
  }
}

export const sortTextCells = (
  rowA: ReactTableRowType<RowType>,
  rowB: ReactTableRowType<RowType>,
  id: keyof RowType
) => {
  const cellAData = rowA.original[id as keyof RowType] as TextCellProps
  const cellBData = rowB.original[id as keyof RowType] as TextCellProps

  return compareCells(cellAData, cellBData, id)
}
