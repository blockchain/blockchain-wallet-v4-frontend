import { UTM } from 'middleware/analyticsMiddleware/constants'

export const getTracking = ({ url }: { url: string }) =>
  fetch(`${url}/events/tracking`, {
    credentials: 'include'
  })

/*
  Analytics usage without redux store coupling.
*/
export const analyticsTrackingNoStore = async (data) => {
  const res = await fetch('/wallet-options-v4.json')
  const options = await res.json()
  const analyticsURL = `${options.domains.api}/events/publish`
  const rawCampaign = sessionStorage.getItem(UTM)
  const campaign = rawCampaign ? JSON.parse(rawCampaign) : {}

  await fetch(analyticsURL, {
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
