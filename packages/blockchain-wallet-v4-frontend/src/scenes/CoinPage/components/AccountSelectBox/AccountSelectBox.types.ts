import { ReactElement, ReactNode } from 'react'

type AccountSelectBoxItem = { text: string; value: string }

type AccountSelectBoxProps<T> = {
  items: AccountSelectBoxItem[]
  label: ReactNode
  onChange: (value: T) => void
  value?: T
}

type AccountSelectBoxComponent = <T extends unknown = unknown>(
  props: AccountSelectBoxProps<T>
) => ReactElement

export type { AccountSelectBoxComponent, AccountSelectBoxItem, AccountSelectBoxProps }
