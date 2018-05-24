import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { equals, prop } from 'ramda'

import { actions } from 'data'
import { getData, getInitialValues } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class FirstStepContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleClickQRCode = this.handleClickQRCode.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    this.props.initialValues.map(x => {
      this.props.formActions.initialize('requestBitcoin', x)
    })
  }

  componentWillReceiveProps (nextProps) {
    nextProps.data.map(x => {
      if (equals(prop('coin', x), 'ETH')) {
        this.props.modalActions.closeAllModals()
        this.props.modalActions.showModal('RequestEther')
      } else if (equals(prop('coin', x), 'BCH')) {
        this.props.modalActions.closeAllModals()
        this.props.modalActions.showModal('RequestBch')
      }
    })
  }

  handleClickQRCode (value) {
    this.props.modalActions.showModal('QRCode', { value })
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.nextStep()
  }

  render () {
    const { data } = this.props

    return data.cata({
      Success: (value) => <Success
        receiveAddress={value.receiveAddress}
        handleClickQRCode={() => this.handleClickQRCode(value)}
        handleSubmit={this.handleSubmit}
      />,
      Failure: (message) => <Error>{message}</Error>,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })
  }
}

const mapStateToProps = (state) => ({
  initialValues: getInitialValues(state),
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  bitcoinDataActions: bindActionCreators(actions.core.data.bitcoin, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(FirstStepContainer)
