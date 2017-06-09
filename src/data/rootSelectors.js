import { compose, prop, map } from 'ramda'
import settings from 'config'

import { coreSelectors } from 'dream-wallet/lib'
import activitySelectors from 'data/Activity/selectors'

const extendSelectors = cs => compose(cs, prop(settings.BLOCKCHAIN_DATA_PATH))

export default {
  core: map(extendSelectors, coreSelectors),
  activity: activitySelectors
}
