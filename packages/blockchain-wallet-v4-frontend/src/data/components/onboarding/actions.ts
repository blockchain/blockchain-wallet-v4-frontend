import * as AT from './actionTypes'

export const airdropClaimSubmitClicked = (campaign) => ({
  payload: { campaign },
  type: AT.AIRDROP_CLAIM_SUBMIT_CLICKED
})

export const setWalletTourVisibility = (visibility) => ({
  payload: visibility,
  type: AT.SET_WALLET_TOUR_VISIBILITY
})

export const swapGetStartedSubmitClicked = () => ({
  type: AT.SWAP_GET_STARTED_SUBMIT_CLICKED
})

export const upgradeForAirdropSubmitClicked = (campaign) => ({
  payload: { campaign },
  type: AT.UPGRADE_FOR_AIRDROP_SUBMIT_CLICKED
})
