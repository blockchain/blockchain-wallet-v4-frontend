import React from 'react'
import { connect } from 'react-redux'

import { selectors } from 'data'

import { Props } from '..'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class VerifyMagicLink extends React.PureComponent<Props> {
  render() {
    return this.props.data.cata({
      Failure: (val) => <Error error={val} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (val) => <Success {...this.props} {...val} />
    })
  }
}

const mapStateToProps = (state) => ({
  data: selectors.auth.getAuthorizeVerifyDevice(state)
})

const connector = connect(mapStateToProps)

export default connector(VerifyMagicLink)
