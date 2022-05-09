import { UTM } from 'middleware/analyticsMiddleware/constants'

export const getTracking = ({ url }: { url: string }) =>
  fetch(`${url}/events/tracking`, {
    credentials: 'include'
  })

// analytics usage without redux store coupling
export const analyticsTrackingNoStore = async (data) => {
  const rawCampaign = sessionStorage.getItem(UTM)
  const campaign = rawCampaign ? JSON.parse(rawCampaign) : {}

  // assume prod since we may have failed to fetch wallet options
  await fetch('https://api.blockchain.info/events/publish', {
    body: JSON.stringify({
      context: campaign,
      device: 'WEB',
      events: [],
      platform: 'WALLET',
      // Just pass in a data object to re-write
      // any of the body params
      ...data
    }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
}
