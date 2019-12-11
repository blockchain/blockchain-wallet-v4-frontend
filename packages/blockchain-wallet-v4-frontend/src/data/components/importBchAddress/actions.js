import * as AT from './actionTypes'

export const importBchAddressSubmitClicked = addresses => ({
  type: AT.IMPORT_BCH_ADDRESS_SUBMIT_CLICKED,
  payload: { addresses }
})
