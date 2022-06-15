export const createBuyOrder = ({
  accountAddress,
  asset,
  expirationTime,
  paymentTokenAddress,
  quantity = 1,
  startAmount
}: {
  accountAddress: string
  asset: Asset
  expirationTime?: BigNumberInput
  paymentTokenAddress?: string
  quantity?: BigNumberInput
  startAmount: BigNumberInput
}) => {}
