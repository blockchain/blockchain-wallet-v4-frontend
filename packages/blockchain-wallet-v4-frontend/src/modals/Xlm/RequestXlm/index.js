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

class RequestXlmContainer extends React.PureComponent {
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
    } else if (coin === 'ETH') {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('RequestEth', {
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
    this.props.formActions.initialize('requestXlm', this.props.initialValues)
  }

  onSubmit = () => {
    this.props.modalActions.closeAllModals()
  }

  handleRefresh = () => {
    this.props.kvStoreXlmActions.fetchMetadataXlm()
    this.props.dataXlmActions.fetchData()
  }

  handleOpenLockbox = () => {
    this.props.requestXlmActions.openLockboxAppClicked()
  }

  render () {
    const { data, closeAll, selection, coins } = this.props

    const content = data.cata({
      Success: val => (
        <Success
          {...this.props}
          {...val}
          closeAll={closeAll}
          coins={coins}
          selection={selection}
          onSubmit={this.onSubmit}
          handleOpenLockbox={this.handleOpenLockbox}
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
            id='modals.requestxlm.title'
            defaultMessage='Request Stellar'
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
  coin: formValueSelector('requestXlm')(state, 'coin')
})

const mapDispatchToProps = dispatch => ({
  requestXlmActions: bindActionCreators(
    actions.components.requestXlm,
    dispatch
  ),
  kvStoreXlmActions: bindActionCreators(actions.core.kvStore.xlm, dispatch),
  dataXlmActions: bindActionCreators(actions.core.data.xlm, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  modalEnhancer('RequestXlm'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(RequestXlmContainer)
