import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { equals, prop } from 'ramda'

import { actions } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { getData, getInitialValues } from './selectors'
import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'
import { FormattedMessage } from 'react-intl'
import { Remote } from 'blockchain-wallet-v4/src'
import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'

class RequestBchContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.init = this.init.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentWillMount () {
    this.init()
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

  componentDidUpdate (prevProps) {
    if (!Remote.Success.is(prevProps.initialValues) && Remote.Success.is(this.props.initialValues)) {
      this.init()
    }
  }

  init () {
    this.props.initialValues.map(x => {
      this.props.formActions.initialize('requestBch', x)
    })
  }

  handleSubmit (e) {
    e.preventDefault()
    this.props.modalActions.closeAllModals()
  }

  handleRefresh () {
    this.props.refreshActions.refresh()
  }

  render () {
    const { data, closeAll } = this.props

    const content = data.cata({
      Success: (value) => <Success
        receiveAddress={value.receiveAddress}
        handleSubmit={this.handleSubmit}
        closeAll={closeAll}
      />,
      NotAsked: () => <DataError onClick={this.handleRefresh} />,
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />
    })

    return <Modal size='large' position={this.props.position} total={this.props.total}>
      <ModalHeader icon='request' onClose={this.props.closeAll}>
        <FormattedMessage id='modals.requestbch.title' defaultMessage='Request Bitcoin Cash' />
      </ModalHeader>
      <ModalBody>
        {content}
      </ModalBody>
    </Modal>
  }
}

const mapStateToProps = (state) => ({
  initialValues: getInitialValues(state),
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  bchDataActions: bindActionCreators(actions.core.data.bch, dispatch),
  refreshActions: bindActionCreators(actions.core.refresh, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  modalEnhancer('RequestBch'),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(RequestBchContainer)
