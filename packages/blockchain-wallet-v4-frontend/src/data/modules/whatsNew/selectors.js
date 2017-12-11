import * as selectors from './../../selectors'

export const getWhatsNew = (state) => ({
  data: selectors.core.kvStore.whatsNew.getLastViewed(state)
})
