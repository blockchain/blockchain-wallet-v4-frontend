import { equals, prop } from 'ramda'

export const changeSource = (currentSource, newSource, currentTarget, defaultAccounts) => {
  const currentSourceCoin = prop('coin', currentSource)
  const newSourceCoin = prop('coin', newSource)
  const currentTargetCoin = prop('coin', currentTarget)

  if (!equals(currentSourceCoin, newSourceCoin) && equals(currentTargetCoin, newSourceCoin)) {
    const newTarget = prop(currentSourceCoin, defaultAccounts)
    return { source: newSource, target: newTarget }
  }
  return { source: newSource, target: currentTarget }
}

export const changeTarget = (currentTarget, newTarget, currentSource, defaultAccounts) => {
  const currentTargetCoin = prop('coin', currentTarget)
  const newTargetCoin = prop('coin', newTarget)
  const currentSourceCoin = prop('coin', currentSource)
  if (!equals(currentTargetCoin, newTargetCoin) && equals(currentSourceCoin, newTargetCoin)) {
    const newSource = prop(currentTargetCoin, defaultAccounts)
    return { source: newSource, target: newTarget }
  }
  return { source: currentSource, target: newTarget }
}
