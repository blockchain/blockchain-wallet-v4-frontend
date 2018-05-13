import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { equals, prop } from 'ramda'

import modalEnhancer from 'providers/ModalEnhancer'
import { actions } from 'data'
import { getData, getInitialValues } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class RequestBchContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentWillMount () {
    this.props.initialValues.map(x => {
      this.props.formActions.initialize('requestBch', x)
    })
  }

  componentWillReceiveProps (nextProps) {
    nextProps.data.map(x => {
      if (equals(prop('coin', x), 'ETH')) {
        this.props.modalActions.closeAllModals()
        this.props.modalActions.showModal('RequestEther')
      } else if (equals(prop('coin', x), 'BTC')) {
        this.props.modalActions.closeAllModals()
        this.props.modalActions.showModal('RequestBitcoin')
      }
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.modalActions.closeAllModals()
  }

  render () {
    const { data, closeAll } = this.props

    return data.cata({
      Success: (value) => <Success
        receiveAddress={value.receiveAddress}
        handleSubmit={this.handleSubmit}
        closeAll={closeAll}
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
  bchDataActions: bindActionCreators(actions.core.data.bch, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  modalEnhancer('RequestBch'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(RequestBchContainer)
