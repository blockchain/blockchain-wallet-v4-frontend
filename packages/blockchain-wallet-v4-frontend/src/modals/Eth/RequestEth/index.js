import React from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { getData, getInitialValues } from './selectors'
import modalEnhancer from 'providers/ModalEnhancer'
import { actions } from 'data'
import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'
import { FormattedMessage } from 'react-intl'
import { Remote } from 'blockchain-wallet-v4/src'
import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'

class RequestEthContainer extends React.PureComponent {
  componentDidMount () {
    this.init()
  }

  componentDidUpdate (prevProps) {
    const { coin } = this.props

    if (coin === 'BTC') {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('RequestBtc', {
        lockboxIndex: this.props.lockboxIndex
      })
    } else if (coin === 'BCH') {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('RequestBch', {
        lockboxIndex: this.props.lockboxIndex
      })
    } else if (coin === 'XLM') {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('RequestXlm', {
        lockboxIndex: this.props.lockboxIndex
      })
    }
    if (
      !Remote.Success.is(prevProps.initialValues) &&
      Remote.Success.is(this.props.initialValues)
    ) {
      this.init()
    }
  }

  init = () => {
    this.props.formActions.initialize('requestEth', this.props.initialValues)
  }

  onSubmit = () => {
    this.props.modalActions.closeAllModals()
  }

  handleRefresh = () => {
    this.props.kvStoreEthActions.fetchMetadataEthereum()
  }

  handleOpenLockbox = () => {
    this.props.requestEthActions.openLockboxAppClicked()
  }

  render () {
    const { data, closeAll, selection, coins } = this.props

    const content = data.cata({
      Success: val => (
        <Success
          {...this.props}
          type={val.type}
          coins={coins}
          closeAll={closeAll}
          selection={selection}
          address={val.address}
          onSubmit={this.onSubmit}
          handleOpenLockbox={this.handleOpenLockbox}
          excludeLockbox={val.excludeLockbox}
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
            id='modals.requestether.title'
            defaultMessage='Request Ether'
          />
        </ModalHeader>
        <ModalBody>{content}</ModalBody>
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state),
  initialValues: getInitialValues(state, ownProps),
  coin: formValueSelector('requestEth')(state, 'coin')
})

const mapDispatchToProps = dispatch => ({
  kvStoreEthActions: bindActionCreators(
    actions.core.kvStore.ethereum,
    dispatch
  ),
  requestEthActions: bindActionCreators(
    actions.components.requestEth,
    dispatch
  ),
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  modalEnhancer('RequestEth'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(RequestEthContainer)
