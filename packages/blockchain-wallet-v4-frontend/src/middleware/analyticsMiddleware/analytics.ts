import { queuevent } from '@blockchain-com/constellation'

import type { AnalyticsValue, RawEvent } from 'middleware/analyticsMiddleware/types'
import { AnalyticsKey } from 'middleware/analyticsMiddleware/types'

import { QUEUE_NAME, UTM } from './constants'

const queueCallback = async (rawEvents: RawEvent[]) => {
  try {
    const res = await fetch('/wallet-options-v4.json')
    const options = await res.json()

    const analyticsURL = `${options.domains.api}/events/publish`

    const nabuId =
      rawEvents.find((event) => event.payload.traits.nabuId)?.payload.traits.nabuId ?? null
    const email =
      rawEvents.find((event) => event.payload.traits.email)?.payload.traits.email ?? null
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

      const { originalTimestamp, ...properties } = event.payload.properties

      return {
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
        platform: 'WALLET'
      }),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
  } catch (e) {
    console.error(e)
  }
}

const analytics = queuevent<AnalyticsKey, AnalyticsValue>({
  queueCallback,
  // Chaging queue name so it won't conflict with the new queue in
  // packages/blockchain-wallet-v4-frontend/src/data/analytics/analytics.ts
  // When queues have the same name, one can clear the other
  queueName: `old-${QUEUE_NAME}`
})

export default analytics
