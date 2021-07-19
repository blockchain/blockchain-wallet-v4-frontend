import { queuevent } from '@blockchain-com/constellation'
import type { AnalyticsValue, RawEvent } from 'middleware/analyticsMiddleware/types'
import { AnalyticsKey } from 'middleware/analyticsMiddleware/types'
import { generateUniqueUserId } from 'middleware/analyticsMiddleware/utils'

const queueCallback = async (rawEvents: RawEvent[]) => {
  const res = await fetch('/wallet-options-v4.json')
  const options = await res.json()

  const analyticsURL = `${options.domains.api}/events/publish`

  const id = rawEvents.find((event) => event.payload.properties.id)?.payload.properties.id

  const nabuId =
    rawEvents.find((event) => event.payload.traits.nabuId)?.payload.traits.nabuId ?? null
  const email = rawEvents.find((event) => event.payload.traits.email)?.payload.traits.email ?? null
  const tier = rawEvents.find((event) => event.payload.traits.tier)?.payload.traits.tier ?? null
  const parsedTier = tier ? String(tier) : null

  const context = {
    traits: {
      email,
      nabu_id: nabuId,
      tier: parsedTier
    }
  } as const

  const events = rawEvents.map((event) => {
    const name = event.key

    const { id, originalTimestamp, ...properties } = event.payload.properties

    return {
      id: id ? generateUniqueUserId(id) : null,
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
      id: id ? generateUniqueUserId(id) : null,
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
  queueName: 'analytics'
})

export default analytics
