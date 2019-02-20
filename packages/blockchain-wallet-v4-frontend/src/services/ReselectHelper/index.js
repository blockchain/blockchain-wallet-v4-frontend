import deepEqual from 'fast-deep-equal'
import { createSelectorCreator, defaultMemoize } from 'reselect'

export const createDeepEqualSelector = createSelectorCreator(
  defaultMemoize,
  deepEqual
)
