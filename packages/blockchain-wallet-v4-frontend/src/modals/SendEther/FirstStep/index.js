import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Remote } from 'blockchain-wallet-v4/src'
import { getData } from './selectors'
import { initializeForm, switchToBitcoinOrBchModal } from './services'
import { actions } from 'data'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStepContainer extends React.Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    this.props.dataEthereumActions.fetchFee()
  }

  componentWillReceiveProps (nextProps) {
    if (Remote.Success.is(nextProps.data)) {
      // We initialize the form if form is not initialized yet
      initializeForm(this.props, nextProps)
      // We open the RequestEther modal if coin equals 'ETH'
      switchToBitcoinOrBchModal(nextProps)
    }
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.nextStep()
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <Success fee={value.fee} effectiveBalance={value.effectiveBalance} handleSubmit={this.handleSubmit} />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  dataEthereumActions: bindActionCreators(actions.core.data.ethereum, dispatch),
  formActions: bindActionCreators(actions.form, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
