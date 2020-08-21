import { createSelectorCreator, defaultMemoize } from 'reselect'
import deepEqual from 'fast-deep-equal'

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  deepEqual
)
