import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import { RemoteData } from 'blockchain-wallet-v4/src'

import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class EtherBalance extends React.Component {
  componentWillMount () {
    this.props.actions.fetchData(this.props.context)
  }

  render () {
    const { data } = this.props
    console.log('EtherBalance render', data)

    return RemoteData.caseOf(data.value, {
      Success: (value) => <Success etherBalance={value} />,
      Failed: (message) => <Error>{message}</Error>,
      _: () => <Loading />
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
