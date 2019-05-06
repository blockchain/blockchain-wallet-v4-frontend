import React from 'react'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { propOr } from 'ramda'
import { FormattedHTMLMessage } from 'react-intl'
import { formValueSelector } from 'redux-form'

import { getData, getInitialValues } from './selectors'
import modalEnhancer from 'providers/ModalEnhancer'
import { actions, selectors, model } from 'data'
import Loading from './template.loading'
import Success from './template.success'
import DataError from 'components/DataError'
import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'

const { TRANSACTION_EVENTS } = model.analytics
class RequestEthContainer extends React.PureComponent {
  componentDidMount () {
    this.init()
  }

  componentDidUpdate (prevProps) {
    const { coin } = this.props

    if (coin === 'BTC') {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('@MODAL.REQUEST.BTC', {
        lockboxIndex: this.props.lockboxIndex
      })
    } else if (coin === 'BCH') {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('@MODAL.REQUEST.BCH', {
        lockboxIndex: this.props.lockboxIndex
      })
    } else if (coin === 'XLM') {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('@MODAL.REQUEST.XLM', {
        lockboxIndex: this.props.lockboxIndex
      })
      // TODO: ERC20 make more generic
    } else if (coin === 'PAX' && prevProps.coin !== coin) {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('@MODAL.REQUEST.ETH', {
        coin: 'PAX',
        lockboxIndex: this.props.lockboxIndex
      })
    } else if (coin === 'ETH' && prevProps.coin !== coin) {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('@MODAL.REQUEST.ETH', {
        coin: 'ETH',
        lockboxIndex: this.props.lockboxIndex
      })
    } else if (this.props.initialValues.coin !== prevProps.initialValues.coin) {
      this.props.formActions.initialize('requestEth', this.props.initialValues)
    }
  }

  componentWillUnmount () {
    this.props.formActions.reset('requestEth')
  }

  init = () => {
    this.props.formActions.initialize('requestEth', this.props.initialValues)
  }

  onSubmit = () => {
    this.props.analyticsActions.logEvent([...TRANSACTION_EVENTS.REQUEST, 'ETH'])
    this.props.modalActions.closeAllModals()
  }

  handleRefresh = () => {
    this.props.kvStoreEthActions.fetchMetadataEth()
  }

  handleOpenLockbox = () => {
    this.props.requestEthActions.openLockboxAppClicked()
  }

  render () {
    const { coin, closeAll, data, position, total, supportedCoins } = this.props
    const content = data.cata({
      Success: val => (
        <Success
          address={val.address}
          coin={coin}
          excludeLockbox={val.excludeLockbox}
          handleOpenLockbox={this.handleOpenLockbox}
          isErc20={supportedCoins[coin].contractAddress}
          onSubmit={this.onSubmit}
          type={val.type}
        />
      ),
      NotAsked: () => <DataError onClick={this.handleRefresh} />,
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />
    })

    return (
      <Modal size='large' position={position} total={total}>
        <ModalHeader icon='download2' onClose={closeAll}>
          <FormattedHTMLMessage
            id='modals.requesteth.title'
            defaultMessage='Request {displayName}'
            values={{
              displayName: supportedCoins[coin].displayName
            }}
          />
        </ModalHeader>
        <ModalBody>{content}</ModalBody>
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, propOr('ETH', 'coin', ownProps)),
  initialValues: getInitialValues(state, ownProps),
  coin:
    formValueSelector('requestEth')(state, 'coin') ||
    propOr('ETH', 'coin', ownProps),
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail()
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  kvStoreEthActions: bindActionCreators(actions.core.kvStore.eth, dispatch),
  requestEthActions: bindActionCreators(
    actions.components.requestEth,
    dispatch
  ),
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  modalEnhancer('@MODAL.REQUEST.ETH'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(RequestEthContainer)
