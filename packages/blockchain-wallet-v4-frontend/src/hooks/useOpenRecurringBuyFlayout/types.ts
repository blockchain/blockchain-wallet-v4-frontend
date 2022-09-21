import { RecurringBuyOrigins, RecurringBuyRegisteredList } from 'data/types'

export type useOpenRecurringBuyFlayoutHookOpenCallback = (args: {
  origin: keyof typeof RecurringBuyOrigins
  recurringBuy: RecurringBuyRegisteredList
}) => void

export type useOpenRecurringBuyFlayoutHook = () => useOpenRecurringBuyFlayoutHookOpenCallback
