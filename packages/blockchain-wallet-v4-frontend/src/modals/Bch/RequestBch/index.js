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
import Announcements from 'components/Announcements'

class RequestBchContainer extends React.PureComponent {
  componentDidMount () {
    this.init()
  }

  componentDidUpdate (prevProps) {
    this.props.data.map(x => {
      if (equals(prop('coin', x), 'ETH')) {
        this.props.modalActions.closeAllModals()
        this.props.modalActions.showModal('RequestEth', {
          lockboxIndex: this.props.lockboxIndex
        })
      } else if (equals(prop('coin', x), 'BTC')) {
        this.props.modalActions.closeAllModals()
        this.props.modalActions.showModal('RequestBtc', {
          lockboxIndex: this.props.lockboxIndex
        })
      } else if (equals(prop('coin', x), 'XLM')) {
        this.props.modalActions.closeAllModals()
        this.props.modalActions.showModal('RequestXlm', {
          lockboxIndex: this.props.lockboxIndex
        })
      }
    })
    if (
      !Remote.Success.is(prevProps.initialValues) &&
      Remote.Success.is(this.props.initialValues)
    ) {
      this.init()
    }
  }

  init = () => {
    this.props.initialValues.map(x => {
      this.props.formActions.initialize('requestBch', x)
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.modalActions.closeAllModals()
  }

  handleRefresh = () => {
    const { bchDataActions, initialValues } = this.props
    if (!Remote.Success.is(initialValues)) return bchDataActions.fetchData()

    this.init()
  }

  handleOpenLockbox = () => {
    this.props.requestBchActions.openLockboxAppClicked()
  }

  render () {
    const { data, closeAll } = this.props

    const content = data.cata({
      Success: value => (
        <Success
          handleOpenLockbox={this.handleOpenLockbox}
          receiveAddress={value.receiveAddress}
          legacyAddress={value.legacyAddress}
          handleSubmit={this.handleSubmit}
          type={value.type}
          closeAll={closeAll}
          excludeLockbox={value.excludeLockbox}
        />
      ),
      NotAsked: () => <DataError onClick={this.handleRefresh} />,
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />
    })

    return (
      <Modal
        size='large'
        position={this.props.position}
        total={this.props.total}
      >
        <ModalHeader icon='request' onClose={this.props.closeAll}>
          <FormattedMessage
            id='modals.requestbch.title'
            defaultMessage='Request Bitcoin Cash'
          />
        </ModalHeader>
        <Announcements type='service' alertArea='receiveBch' />
        <ModalBody>{content}</ModalBody>
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: getInitialValues(state, ownProps),
  data: getData(state, ownProps)
})

const mapDispatchToProps = dispatch => ({
  requestBchActions: bindActionCreators(
    actions.components.requestBch,
    dispatch
  ),
  bchDataActions: bindActionCreators(actions.core.data.bch, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  modalEnhancer('RequestBch'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(RequestBchContainer)
