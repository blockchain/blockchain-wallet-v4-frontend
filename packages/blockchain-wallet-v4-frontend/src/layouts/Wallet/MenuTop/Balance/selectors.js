import { prop } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = state =>
  createDeepEqualSelector(
    [selectors.router.getPathname, selectors.core.settings.getInvitations],
    (path, invitationsR) => ({
      path,
      lockboxEnabled: prop('lockbox', invitationsR.getOrElse({}))
    })
  )(state)
