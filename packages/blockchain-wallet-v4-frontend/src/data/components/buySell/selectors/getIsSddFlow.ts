import { createSelector } from 'reselect'

import { getUserData } from 'data/modules/profile/selectors'

import * as SddFlow from '../utils/sddFlow'

export const getIsSddFlow = createSelector([getUserData], (userDataR) =>
  userDataR.map(SddFlow.isSddUser)
)
