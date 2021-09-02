import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  menuOpened: true
}

const layoutWalletSlice = createSlice({
  initialState,
  name: 'layoutWallet',
  reducers: {
    layoutWalletMenuToggleClicked: (state) => {
      return { menuOpened: !state.menuOpened }
    }
  }
})

export const { layoutWalletMenuToggleClicked } = layoutWalletSlice.actions

const { actions } = layoutWalletSlice
const layoutWalletReducer = layoutWalletSlice.reducer

export { actions, layoutWalletReducer }
