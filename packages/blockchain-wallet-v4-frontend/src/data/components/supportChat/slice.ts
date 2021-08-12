import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { SupportChatStateType } from './types'

const initialState: SupportChatStateType = {
  chatEnabled: false,
  widgetOpen: false
}

const supportChatSlice = createSlice({
  initialState,
  name: 'supportChat',
  reducers: {
    updateChatEnabled: (state, action: PayloadAction<boolean>) => {
      state.chatEnabled = action.payload
    },
    updateChatWidgetOpen: (state, action: PayloadAction<boolean>) => {
      state.widgetOpen = action.payload
    }
  }
})

export const { updateChatEnabled, updateChatWidgetOpen } = supportChatSlice.actions

const { actions } = supportChatSlice
const supportChatReducer = supportChatSlice.reducer
export { actions, supportChatReducer }
