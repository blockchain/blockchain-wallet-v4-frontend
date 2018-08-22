import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { bindActionCreators, compose } from 'redux'
import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { Modal, ModalHeader, ModalBody, ModalFooter, Text, Button, HeartbeatLoader } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { getCanMakeRecurringTrade, getNumberOfTradesAway, getCoinifyStatus } from './selectors'
import { prop } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  button:last-of-type {
    margin-left: 15px;
  }
`
class CoinifyRecurringBuyConfirm extends React.PureComponent {
  componentWillUnmount () {
    this.props.coinifyActions.showRecurringModal(false)
  }

  render () {
    const { canMakeRecurringTrade, numberOfTradesAway, status, coinifyActions } = this.props
    const { handleRecurringModalClose } = coinifyActions

    const textHelper = () => {
      switch (canMakeRecurringTrade) {
        case 'needs_kyc_trades':
          return {
            header: <FormattedMessage id='modals.coinifyrecurringbuyconfirm.header.needskyctrades' defaultMessage='Verify Your Identity and Complete 3 Orders' />,
            body: <FormattedMessage id='modals.coinifyrecurringbuyconfirm.body.needskyctrades' defaultMessage='To unlock the Recurring Buy feature, verify your identity and complete 3 credit card orders.' />,
            button: <FormattedMessage id='modals.coinifyrecurringbuyconfirm.button.needskyctrades' defaultMessage='Verify My Identity' />
          }
        case 'needs_kyc':
          return {
            header: <FormattedMessage id='modals.coinifyrecurringbuyconfirm.header.needskyc' defaultMessage='Verify Your Identity' />,
            body: <FormattedMessage id='modals.coinifyrecurringbuyconfirm.body.needskyc' defaultMessage='To set up a recurring order, you first need to verify your identity.' />,
            button: <FormattedMessage id='modals.coinifyrecurringbuyconfirm.button.needskyc' defaultMessage='Verify My Identity' />
          }
        case 'needs_trades':
          return {
            header: <FormattedMessage id='modals.coinifyrecurringbuyconfirm.header.needstrades' defaultMessage='Complete 3 Orders' />,
            body: <FormattedMessage id='modals.coinifyrecurringbuyconfirm.body.needstrades' defaultMessage='To unlock the recurring buy feature, start by completing 3 credit card orders. You are only {numOfTrades} away.' values={{ numOfTrades: numberOfTradesAway }} />,
            button: <FormattedMessage id='modals.coinifyrecurringbuyconfirm.button.needstrades' defaultMessage='Create an Order' />
          }
        default:
          return <FormattedMessage id='modals.coinifyrecurringbuyconfirm.header.setup' defaultMessage="You're About to Set Up A Recurring Order" />
      }
    }

    const clickHelper = () => {
      switch (canMakeRecurringTrade) {
        case 'needs_kyc':
        case 'needs_kyc_trades':
          this.props.coinifyActions.startKycFromRecurring()
          break
        case 'needs_trades':
          this.props.close()
          this.props.coinifyActions.coinifyNextCheckoutStep('checkout')
          break
        default:
          // TODO: dispatch action to set subscription to true to it gets passed to core when user buys
          console.log('can make recurring trade')
      }
    }

    return <Modal>
      <Fragment>
        <ModalHeader onClose={handleRecurringModalClose}>
          <Text size='18px' weight={500}>
            {prop('header', textHelper())}
          </Text>
        </ModalHeader>
        <ModalBody>
          <Text size='13px' weight={300}>
            {prop('body', textHelper())}
          </Text>
        </ModalBody>
        <ModalFooter align='right'>
          <ButtonRow>
            <Button width='100px' onClick={handleRecurringModalClose} nature='empty'>
              <FormattedMessage id='modals.coinifyrecurringbuyconfirm.goback' defaultMessage='Go Back' />
            </Button>
            <Button nature='primary' onClick={() => clickHelper()}>
              {
                Remote.Loading.is(status)
                  ? <HeartbeatLoader height='20px' width='20px' color='white' />
                  : prop('button', textHelper())
              }
            </Button>
          </ButtonRow>
        </ModalFooter>
      </Fragment>
    </Modal>
  }
}

const mapStateToProps = state => ({
  numberOfTradesAway: getNumberOfTradesAway(state),
  canMakeRecurringTrade: getCanMakeRecurringTrade(state),
  status: getCoinifyStatus(state),
  subscriptions: selectors.core.data.coinify
    .getSubscriptions(state)
    .getOrElse([])
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
  coinifyDataActions: bindActionCreators(actions.core.data.coinify, dispatch),
  coinifyActions: bindActionCreators(actions.modules.coinify, dispatch)
})

const enhance = compose(
  modalEnhancer('CoinifyRecurringBuyConfirm'),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(CoinifyRecurringBuyConfirm)
