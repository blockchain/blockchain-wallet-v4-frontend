import { bindActionCreators, compose } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { FormattedHTMLMessage } from 'react-intl'
import { formValueSelector } from 'redux-form'
import { propOr } from 'ramda'
import React from 'react'
import styled from 'styled-components'

import { actions, model, selectors } from 'data'
import { CoinType, Erc20CoinsEnum, SupportedCoinsType } from 'core/types'
import { getData, getInitialValues } from './selectors'
import { Modal, ModalBody, ModalHeader } from 'blockchain-info-components'
import { ModalPropsType } from 'data/types'
import Announcements from 'components/Announcements'
import DataError from 'components/DataError'
import Loading from './template.loading'
import modalEnhancer from 'providers/ModalEnhancer'
import Success from './template.success'

const RequestHeader = styled(ModalHeader)`
  border-bottom: 0;
  padding-bottom: 0;
  > div:first-child * {
    color: ${props => props.theme.blue900};
  }
`

const { TRANSACTION_EVENTS } = model.analytics
class RequestEthContainer extends React.PureComponent<Props> {
  componentDidMount () {
    this.init()
  }

  componentDidUpdate (prevProps) {
    const { coin } = this.props

    if (coin === 'BTC') {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('@MODAL.REQUEST.BTC', {
        origin: 'Request',
        lockboxIndex: this.props.lockboxIndex
      })
    } else if (coin === 'BCH') {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('@MODAL.REQUEST.BCH', {
        origin: 'Request',
        lockboxIndex: this.props.lockboxIndex
      })
    } else if (coin === 'XLM') {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('@MODAL.REQUEST.XLM', {
        origin: 'Request',
        lockboxIndex: this.props.lockboxIndex
      })
    } else if (coin in Erc20CoinsEnum && prevProps.coin !== coin) {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('@MODAL.REQUEST.ETH', {
        coin,
        origin: 'Request',
        lockboxIndex: this.props.lockboxIndex
      })
    } else if (coin === 'ETH' && prevProps.coin !== coin) {
      this.props.modalActions.closeAllModals()
      this.props.modalActions.showModal('@MODAL.REQUEST.ETH', {
        coin: 'ETH',
        origin: 'Request',
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
      <Modal size='medium' position={position} total={total}>
        <RequestHeader icon='request' onClose={closeAll}>
          <FormattedHTMLMessage
            id='modals.requesteth.title'
            defaultMessage='Request {displayName}'
            values={{
              displayName: supportedCoins[coin].displayName
            }}
          />
        </RequestHeader>
        <Announcements type='service' alertArea='request' currentCoin={coin} />
        <ModalBody>{content}</ModalBody>
      </Modal>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  data: getData(state, propOr('ETH', 'coin', ownProps)),
  initialValues: getInitialValues(state, ownProps),
  coin: (formValueSelector('requestEth')(state, 'coin') ||
    propOr('ETH', 'coin', ownProps)) as CoinType,
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrFail() as SupportedCoinsType
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

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(modalEnhancer('@MODAL.REQUEST.ETH'), connector)

type Props = ConnectedProps<typeof connector> & ModalPropsType

export default enhance(RequestEthContainer)
