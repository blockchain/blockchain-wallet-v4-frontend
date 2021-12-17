import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  menuOpened: false
}

const layoutWalletSlice = createSlice({
  initialState,
  name: 'layoutWallet',
  reducers: {
    layoutWalletMenuToggleClicked: (state) => {
      state.menuOpened = !state.menuOpened
    }
  }
})

export const { layoutWalletMenuToggleClicked } = layoutWalletSlice.actions

const { actions } = layoutWalletSlice
const layoutWalletReducer = layoutWalletSlice.reducer

export { actions, layoutWalletReducer }
