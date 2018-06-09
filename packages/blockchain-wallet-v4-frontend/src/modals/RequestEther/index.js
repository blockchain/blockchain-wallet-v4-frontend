import React from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'

import { getData } from './selectors'
import modalEnhancer from 'providers/ModalEnhancer'
import { actions } from 'data'
import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'
import { FormattedMessage } from 'react-intl'
import { Remote } from 'blockchain-wallet-v4/src'
import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'

class RequestEtherContainer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.init = this.init.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentWillMount () {
    this.init()
  }

  componentWillReceiveProps (nextProps) {
    const { coin } = nextProps
    if (coin === 'BTC') {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('RequestBitcoin')
    } else if (coin === 'BCH') {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('RequestBch')
    }
  }

  componentDidUpdate (prevProps) {
    if (!Remote.Success.is(prevProps.initialValues) && Remote.Success.is(this.props.initialValues)) {
      this.init()
    }
  }

  init () {
    this.props.formActions.initialize('requestEther', this.props.initialValues)
  }

  onSubmit (e) {
    e.preventDefault()
    this.props.modalActions.closeAllModals()
  }

  handleRefresh () {
    this.props.kvStoreEthActions.fetchMetadataEthereum()
  }

  render () {
    const { data, closeAll, selection, coins } = this.props

    const content = data.cata({
      Success: (val) => <Success
        {...this.props}
        address={val}
        closeAll={closeAll}
        coins={coins}
        selection={selection}
        onSubmit={this.onSubmit}
      />,
      NotAsked: () => <DataError onClick={this.handleRefresh} />,
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />
    })

    return <Modal size='large' position={this.props.position} total={this.props.total}>
      <ModalHeader icon='request' onClose={this.props.closeAll}>
        <FormattedMessage id='modals.requestether.title' defaultMessage='Request Ether' />
      </ModalHeader>
      <ModalBody>
        {content}
      </ModalBody>
    </Modal>
  }
}

const mapStateToProps = (state, ownProps) => ({
  initialValues: {
    coin: 'ETH'
  },
  data: getData(state),
  coin: formValueSelector('requestEther')(state, 'coin')
})

const mapDispatchToProps = (dispatch) => ({
  kvStoreEthActions: bindActionCreators(actions.core.kvStore.ethereum, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  modalEnhancer('RequestEther')
)

export default enhance(RequestEtherContainer)
