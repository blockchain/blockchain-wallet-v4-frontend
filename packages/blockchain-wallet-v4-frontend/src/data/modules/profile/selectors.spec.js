import { lift } from 'ramda'

import { Remote } from 'blockchain-wallet-v4'

import { TIERS_STATES } from './model'
import { isUserCreated } from './selectors'

describe('isUserCreated selector', () => {
  const TIERS_DATA = [
    {
      state: TIERS_STATES.NONE
    }
  ]
  const USER_DATA = [
    Remote.Loading,
    Remote.NotAsked,
    Remote.Failure({}),
    Remote.Success({})
  ]
  const TIERS = [
    Remote.Loading,
    Remote.NotAsked,
    Remote.Failure({}),
    Remote.Success(TIERS_DATA)
  ]

  it('should only return remote success if both of userData and tiers are successful', () => {
    USER_DATA.forEach(userData =>
      TIERS.forEach(userTiers => {
        const state = {
          profile: { userData, userTiers }
        }

        if (Remote.Success.is(userData) && Remote.Success.is(userTiers))
          expect(Remote.Success.is(isUserCreated(state))).toBeTruthy()
        else expect(Remote.Success.is(isUserCreated(state))).toBeFalsy()
      })
    )
  })

  it('should return false if first tier state is not NONE and true otherwise', () => {
    for (let tierState in TIERS_STATES) {
      const state = {
        profile: {
          userData: USER_DATA[3],
          userTiers: Remote.Success([
            {
              state: tierState
            }
          ])
        }
      }

      lift(userCreated => {
        if (tierState === TIERS_STATES.NONE) expect(userCreated).toBe(false)
        else expect(userCreated).toBe(true)
      })(isUserCreated(state))
    }
  })
})
