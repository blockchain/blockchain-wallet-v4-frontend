import { queuevent } from '@blockchain-com/constellation'

import { QUEUE_NAME, UTM } from 'middleware/analyticsMiddleware/constants'

import type { AnalyticsValue, RawEvent } from './types/index'
import { AnalyticsKey } from './types/index'

const queueCallback = async (rawEvents: RawEvent[]) => {
  try {
    const res = await fetch('/wallet-options-v4.json')
    const options = await res.json()

    const analyticsURL = `${options.domains.api}/events/publish`

    const nabuId =
      rawEvents.find((event) => event.payload.traits.nabuId)?.payload.traits.nabuId ?? null
    const country = rawEvents.find((event) => event.payload.traits.country)?.payload.traits.country
    const country_state = rawEvents.find((event) => event.payload.traits.country_state)?.payload
      .traits.country_state
    const email =
      rawEvents.find((event) => event.payload.traits.email)?.payload.traits.email ?? null
    const tier = rawEvents.find((event) => event.payload.traits.tier)?.payload.traits.tier ?? null
    const parsedTier = tier ? String(tier) : null

    const rawCampaign = sessionStorage.getItem(UTM)
    const campaign = rawCampaign ? JSON.parse(rawCampaign) : {}

    const traits = {
      country,
      country_state,
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
        platform: 'WALLET',
        version: window.APP_VERSION
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
  queueName: QUEUE_NAME
})

export default analytics
