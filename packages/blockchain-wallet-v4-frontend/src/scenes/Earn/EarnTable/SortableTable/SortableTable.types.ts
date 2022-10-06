import { ButtonCellProps, TextCellProps } from '@blockchain-com/constellation'

export type RowType = {
  actions: ButtonCellProps | TextCellProps
  asset: TextCellProps
  balance: TextCellProps
  rates: TextCellProps
}

export type CellProps = {
  value?: number | string
} & TextCellProps
