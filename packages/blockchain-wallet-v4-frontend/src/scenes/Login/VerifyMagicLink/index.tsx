import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import Failure from 'blockchain-wallet-v4-frontend/src/modals/RecurringBuys/Failure'
import { bindActionCreators } from 'redux'

import { Wrapper } from 'components/Public'
import { actions, selectors } from 'data'

import { Props } from '..'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class VerifyMagicLink extends React.PureComponent<Props> {
  render() {
    return this.props.data.cata({
      Failure: () => <Error />,
      Loading: () => <Loading />,
      NotAsked: () => <Success {...this.props} />,
      Success: () => <Success {...this.props} />
    })
  }
}

const mapStateToProps = (state) => ({
  data: selectors.auth.getAuthorizeVerifyDevice(state)
})

const connector = connect(mapStateToProps)

export default connector(VerifyMagicLink)
