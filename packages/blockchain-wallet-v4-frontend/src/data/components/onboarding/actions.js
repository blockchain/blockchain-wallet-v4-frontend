import * as AT from './actionTypes'

export const swapGetStartedSubmitClicked = () => ({
  type: AT.SWAP_GET_STARTED_SUBMIT_CLICK
})

export const airdropReminderSubmitClicked = campaign => ({
  type: AT.AIRDROP_REMINDER_SUBMIT_CLICK,
  payload: { campaign }
})

export const upgradeForAirdropSubmitClicked = campaign => ({
  type: AT.UPGRADE_FOR_AIRDROP_SUBMIT_CLICKED,
  payload: { campaign }
})
