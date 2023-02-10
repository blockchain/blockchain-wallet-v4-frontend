import { Empty } from './Empty'
import { Failed } from './Failed'
import { Loading } from './Loading'
import { LoadingMore } from './LoadingMore'
import { TokenList as TokenListBase } from './TokenList'

export const TokenList = Object.assign(TokenListBase, {
  Empty,
  Failed,
  Loading,
  LoadingMore
})
