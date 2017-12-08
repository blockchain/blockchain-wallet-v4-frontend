import * as selectors from './../../selectors'

export const getActivity = (state) => ({
  data: selectors.core.data.misc.getLogs(state)
  // state: selectors.core.data.misc.getAdvertsState(state)
})
