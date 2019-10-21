export interface FetchTransactionsAction {
  payload: {
    address: string
    reset: boolean
  }
}
