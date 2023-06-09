export type CompleteSwapProps = {
  baseToken: string
  counterToken: string
  goToEnterDetails: () => void
  onSwappingViewed: () => void
  onViewExplorer: () => void
}

export type FailSwapProps = {
  goToConfirmSwap: () => void
  goToEnterDetails: () => void
  onDexSwapFailViewed: () => void
}
