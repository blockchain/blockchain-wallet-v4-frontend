import * as AT from './actionTypes'

export const airdropClaimSubmitClicked = campaign => ({
  type: AT.AIRDROP_CLAIM_SUBMIT_CLICKED,
  payload: { campaign }
})

export const setWalletTourVisibility = visibility => ({
  type: AT.SET_WALLET_TOUR_VISIBILITY,
  payload: visibility
})

export const swapGetStartedSubmitClicked = () => ({
  type: AT.SWAP_GET_STARTED_SUBMIT_CLICKED
})

export const upgradeForAirdropSubmitClicked = campaign => ({
  type: AT.UPGRADE_FOR_AIRDROP_SUBMIT_CLICKED,
  payload: { campaign }
})
