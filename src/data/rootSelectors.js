import { compose, prop, map } from 'ramda'
import settings from 'config'

import { coreSelectors } from 'dream-wallet/lib'
import activitySelectors from 'data/Activity/selectors'

const extendSelectors = cs => compose(cs, prop(settings.BLOCKCHAIN_DATA_PATH))
const core = map(map(extendSelectors), coreSelectors)

const activity = activitySelectors

export {
  core,
  activity
}
