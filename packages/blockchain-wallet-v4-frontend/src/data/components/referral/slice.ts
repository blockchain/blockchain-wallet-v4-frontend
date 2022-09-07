import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ReferralInformationType, ReferralState } from './types'

const initialState: ReferralState = {
  referralInformation: undefined
}

const referralSlice = createSlice({
  initialState,
  name: 'referral',
  reducers: {
    getReferralInformation: () => {},
    setReferralInformation: (state, action: PayloadAction<ReferralInformationType>) => {
      state.referralInformation = action.payload
    }
  }
})

const { actions } = referralSlice
const referralReducer = referralSlice.reducer
export { actions, referralReducer }
