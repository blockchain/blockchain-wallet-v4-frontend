import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { actions } from 'data'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class EtherBalance extends React.Component {
  componentWillMount () {
    if (Remote.NotAskedIs(this.props.data)) {
      this.props.actions.fetchData(this.props.context)
    }
  }

  render () {
    const { data, large } = this.props

    return data.cata({
      Success: (value) => <Success balance={value} large={large} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

EtherBalance.propTypes = {
  context: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions.core.data.ethereum, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EtherBalance)
