import React from 'react'
import { connect } from 'react-redux'
import { equals, prop } from 'ramda'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { bindActionCreators, compose } from 'redux'
import { formValueSelector } from 'redux-form'

import Announcements from 'components/Announcements'
import { actions, model } from 'data'
import DataError from 'components/DataError'
import { Remote } from 'blockchain-wallet-v4/src'
import modalEnhancer from 'providers/ModalEnhancer'
import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'
import { getData, getInitialValues, getImportedAddresses } from './selectors'
import Loading from './template.loading'
import Success from './template.success'
import ShareLink from './template.shareLink'

const RequestHeader = styled(ModalHeader)`
  border-bottom: 0;
  padding-bottom: 0;
  > div:first-child * {
    color: ${props => props.theme['brand-primary']};
  }
`

const { TRANSACTION_EVENTS } = model.analytics
class RequestBtcContainer extends React.PureComponent {
  state = {
    requestBuilt: false,
    showRequestLink: false
  }

  componentDidMount () {
    this.init()
  }

  componentDidUpdate (prevProps) {
    this.props.data.map(x => {
      if (equals(prop('coin', x), 'PAX')) {
        this.props.modalActions.closeAllModals()
        this.props.modalActions.showModal('@MODAL.REQUEST.ETH', {
          coin: 'PAX',
          lockboxIndex: this.props.lockboxIndex
        })
      } else if (equals(prop('coin', x), 'ETH')) {
        this.props.modalActions.closeAllModals()
        this.props.modalActions.showModal('@MODAL.REQUEST.ETH', {
          coin: 'ETH',
          lockboxIndex: this.props.lockboxIndex
        })
      } else if (equals(prop('coin', x), 'BCH')) {
        this.props.modalActions.closeAllModals()
        this.props.modalActions.showModal('@MODAL.REQUEST.BCH', {
          lockboxIndex: this.props.lockboxIndex
        })
      } else if (equals(prop('coin', x), 'XLM')) {
        this.props.modalActions.closeAllModals()
        this.props.modalActions.showModal('@MODAL.REQUEST.XLM', {
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
      this.props.formActions.initialize('requestBtc', x)
    })
  }

  handleOpenLockbox = () => {
    this.props.requestBtcActions.openLockboxAppClicked()
  }

  onToggleMakeRequestLink = () => {
    this.setState({
      requestBuilt: false,
      showRequestLink: !this.state.showRequestLink
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const {
      accountIdx,
      addressIdx,
      message,
      receiveAddress
    } = this.props.data.getOrElse({})
    this.props.requestBtcActions.firstStepSubmitClicked({
      accountIdx,
      addressIdx,
      message
    })
    this.setState({
      receiveAddress,
      requestBuilt: true
    })
    this.props.analyticsActions.logEvent([...TRANSACTION_EVENTS.REQUEST, 'BTC'])
  }

  handleRefresh = () => {
    const { btcDataActions, initialValues } = this.props
    if (!Remote.Success.is(initialValues)) return btcDataActions.fetchData()

    this.init()
  }

  setReceiveAddress = addr => {
    this.setState({ receiveAddress: addr, requestBuilt: false })
  }

  render () {
    const { data, importedAddresses, position, total, closeAll } = this.props

    const content = data.cata({
      Success: value => (
        <Success
          type={value.type}
          message={value.message}
          addressIdx={value.addressIdx}
          accountIdx={value.accountIdx}
          receiveAddress={value.receiveAddress}
          handleOpenLockbox={this.handleOpenLockbox}
          onToggleMakeRequestLink={this.onToggleMakeRequestLink}
          handleSubmit={this.handleSubmit}
          importedAddresses={importedAddresses}
          excludeLockbox={value.excludeLockbox}
          setReceiveAddress={this.setReceiveAddress}
          showRequestLinkBuilder={this.state.showRequestLink}
          closeAll={closeAll}
        />
      ),
      NotAsked: () => <DataError onClick={this.handleRefresh} />,
      Failure: () => <DataError onClick={this.handleRefresh} />,
      Loading: () => <Loading />
    })

    return (
      <Modal size='medium' position={position} total={total}>
        <RequestHeader icon='request' onClose={closeAll}>
          <FormattedMessage
            id='modals.requestbtc.title'
            defaultMessage='Request Bitcoin'
          />
        </RequestHeader>
        <Announcements type='service' alertArea='request' currentCoin='BTC' />
        <ModalBody>
          {this.state.requestBuilt ? (
            <ShareLink {...this.props} {...this.state} />
          ) : (
            content
          )}
        </ModalBody>
      </Modal>
    )
  }
}
const mapStateToProps = (state, ownProps) => ({
  initialValues: getInitialValues(state, ownProps),
  data: getData(state),
  importedAddresses: getImportedAddresses(state),
  requestAmount: formValueSelector('requestBtc')(state, 'amount'),
  requestMessage: formValueSelector('requestBtc')(state, 'message'),
  requestTo: formValueSelector('requestBtc')(state, 'to')
})

const mapDispatchToProps = dispatch => ({
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  requestBtcActions: bindActionCreators(
    actions.components.requestBtc,
    dispatch
  ),
  btcDataActions: bindActionCreators(actions.core.data.btc, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  modalEnhancer('@MODAL.REQUEST.BTC'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(RequestBtcContainer)
