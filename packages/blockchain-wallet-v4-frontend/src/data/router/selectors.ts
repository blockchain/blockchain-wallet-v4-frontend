import { nth, path, split, toUpper } from 'ramda'

export const getPathname = path(['router', 'location', 'pathname'])
export const getSearch = path(['router', 'location', 'search'])
export const getCoinFromPageUrl = (state): string | undefined => {
  const coin = toUpper(
    // @ts-ignore
    nth(1, split('/', path(['router', 'location', 'pathname'], state)))
  )
  return window.coins[coin] ? coin : undefined
}
