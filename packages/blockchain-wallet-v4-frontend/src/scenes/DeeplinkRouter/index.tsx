import { connect, ConnectedProps } from 'react-redux'
import qs from 'qs'
import { bindActionCreators, Dispatch } from 'redux'

import { actions, selectors } from 'data'
import { AppDeeplinkParams } from 'data/auth/types.deeplinks'

const DeeplinkRouter = ({ authActions, pathname, search }: Props) => {
  // parse and store deeplink data for use after auth flow has finished
  const deeplinkParams = qs.parse(search as string, { ignoreQueryPrefix: true })
  authActions.setDeeplinkData({
    params: deeplinkParams as AppDeeplinkParams,
    route: pathname as string
  })
  // call to route pre-auth app (login or signup)
  authActions.determinePreAuthRouteForDeeplink()
  return null
}

const mapStateToProps = (state) => ({
  pathname: selectors.router.getPathname(state),
  search: selectors.router.getSearch(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(DeeplinkRouter)
