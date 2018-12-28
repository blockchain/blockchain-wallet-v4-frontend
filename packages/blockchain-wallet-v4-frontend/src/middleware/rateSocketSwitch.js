import { contains, invertObj, mapObjIndexed, prop, values } from 'ramda'

import { actionTypes, selectors } from 'data'

const ratesSocketActionTypes = values(actionTypes.middleware.webSocket.rates)

const publicActionTypesMap = mapObjIndexed(
  key => actionTypes.middleware.webSocket.publicRates[key],
  invertObj(actionTypes.middleware.webSocket.rates)
)

const rateSocketSwitch = store => next => action => {
  const type = prop('type', action)
  if (!contains(type, ratesSocketActionTypes)) return next(action)

  const userVerified = selectors.modules.profile
    .isUserVerified(store.getState())
    .getOrElse(false)
  if (userVerified) return next(action)

  return next({ ...action, type: publicActionTypesMap[type] })
}

export default rateSocketSwitch
