import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { equals, prop } from 'ramda'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { actions, model } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import DataError from 'components/DataError'
import { Remote } from 'blockchain-wallet-v4/src'
import Announcements from 'components/Announcements'
import { Modal, ModalHeader, ModalBody } from 'blockchain-info-components'
import { getData, getInitialValues } from './selectors'
import Loading from './template.loading'
import Success from './template.success'

const RequestHeader = styled(ModalHeader)`
  border-bottom: 0;
  padding-bottom: 0;
  > div:first-child * {
    color: ${props => props.theme['brand-primary']};
  }
`

const { TRANSACTION_EVENTS } = model.analytics
class RequestBchContainer extends React.PureComponent {
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
      } else if (equals(prop('coin', x), 'BTC')) {
        this.props.modalActions.closeAllModals()
        this.props.modalActions.showModal('@MODAL.REQUEST.BTC', {
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
      this.props.formActions.initialize('requestBch', x)
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.analyticsActions.logEvent([...TRANSACTION_EVENTS.REQUEST, 'BCH'])
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
    const { closeAll, data, position, total } = this.props

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
      <Modal size='medium' position={position} total={total}>
        <RequestHeader icon='request' onClose={closeAll}>
          <FormattedMessage
            id='modals.requestbch.title'
            defaultMessage='Request Bitcoin Cash'
          />
        </RequestHeader>
        <Announcements type='service' alertArea='request' currentCoin='BCH' />
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
  analyticsActions: bindActionCreators(actions.analytics, dispatch),
  requestBchActions: bindActionCreators(
    actions.components.requestBch,
    dispatch
  ),
  bchDataActions: bindActionCreators(actions.core.data.bch, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  modalEnhancer('@MODAL.REQUEST.BCH'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(RequestBchContainer)
