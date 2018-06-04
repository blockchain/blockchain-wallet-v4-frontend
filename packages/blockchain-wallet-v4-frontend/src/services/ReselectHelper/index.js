import { equals } from 'ramda'
import { createSelectorCreator, defaultMemoize } from 'reselect'

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  equals
)
