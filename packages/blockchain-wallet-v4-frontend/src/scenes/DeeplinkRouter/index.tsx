import { connect, ConnectedProps } from 'react-redux'
import qs from 'qs'
import { bindActionCreators, Dispatch } from 'redux'

import { actions, selectors } from 'data'

const DeeplinkRouter = ({ authActions, pathname, routerActions, search }: Props) => {
  // store deeplink data for use after auth flow has finished
  const params = qs.parse(search as string, { ignoreQueryPrefix: true })
  authActions.setDeeplinkData({
    params,
    route: pathname as string
  })
  // push to login screen
  routerActions.push('/login')
  return null
}

const mapStateToProps = (state) => ({
  pathname: selectors.router.getPathname(state),
  search: selectors.router.getSearch(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  routerActions: bindActionCreators(actions.router, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(DeeplinkRouter)
