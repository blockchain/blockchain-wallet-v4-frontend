import { queuevent } from '@blockchain-com/constellation'
import type { AnalyticsValue, RawEvent } from 'middleware/analyticsMiddleware/types'
import { AnalyticsKey } from 'middleware/analyticsMiddleware/types'
import { generateUniqueId } from 'middleware/analyticsMiddleware/utils'

import { ANALYTICS_ID, QUEUE_NAME, UTM } from './constants'

const queueCallback = async (rawEvents: RawEvent[]) => {
  const res = await fetch('/wallet-options-v4.json')
  const options = await res.json()

  const analyticsURL = `${options.domains.api}/events/publish`

  const guid = rawEvents.find((event) => event.payload.properties.guid)?.payload.properties.guid
  const id = localStorage.getItem(ANALYTICS_ID)

  const nabuId =
    rawEvents.find((event) => event.payload.traits.nabuId)?.payload.traits.nabuId ?? null
  const email = rawEvents.find((event) => event.payload.traits.email)?.payload.traits.email ?? null
  const tier = rawEvents.find((event) => event.payload.traits.tier)?.payload.traits.tier ?? null
  const parsedTier = tier ? String(tier) : null

  const rawCampaign = sessionStorage.getItem(UTM)
  const campaign = rawCampaign ? JSON.parse(rawCampaign) : {}

  const traits = {
    email,
    nabu_id: nabuId,
    tier: parsedTier
  }

  const context = {
    campaign,
    traits
  } as const

  const events = rawEvents.map((event) => {
    const name = event.key

    const { guid, originalTimestamp, ...properties } = event.payload.properties

    return {
      id: guid ? generateUniqueId(guid) : id,
      nabuId,
      name,
      originalTimestamp,
      properties
    }
  })

  await fetch(analyticsURL, {
    body: JSON.stringify({
      context,
      device: 'WEB',
      events,
      id: guid ? generateUniqueId(guid) : id,
      platform: 'WALLET'
    }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST'
  })
}

const analytics = queuevent<AnalyticsKey, AnalyticsValue>({
  queueCallback,
  queueName: QUEUE_NAME
})

export default analytics
