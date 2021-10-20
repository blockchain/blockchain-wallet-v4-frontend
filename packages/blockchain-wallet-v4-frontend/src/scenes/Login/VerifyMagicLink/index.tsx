import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Text } from 'blockchain-info-components'
import { actions, selectors } from 'data'

import { Props } from '..'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class VerifyMagicLink extends React.PureComponent<Props> {
  render() {
    return this.props.data.cata({
      Failure: (val) => <Error error={val} />,
      Loading: () => <Loading />,
      NotAsked: () => <Success {...this.props} success={false} />,
      Success: () => <Success {...this.props} success />
    })
  }
}

const mapStateToProps = (state) => ({
  data: selectors.auth.getAuthorizeVerifyDevice(state)
})

const connector = connect(mapStateToProps)

export default connector(VerifyMagicLink)
