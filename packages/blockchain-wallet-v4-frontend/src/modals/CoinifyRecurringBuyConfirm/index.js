import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { bindActionCreators, compose } from 'redux'
import { actions, selectors } from 'data'
import modalEnhancer from 'providers/ModalEnhancer'
import { Modal, ModalHeader, ModalBody, Text, Button } from 'blockchain-info-components'
import { FormattedMessage } from 'react-intl'
import { getData, getCanMakeRecurringTrade } from './selectors'

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
`
class CoinifyRecurringBuyConfirm extends React.PureComponent {
  render () {
    const { close } = this.props
    return (
      <Modal>
        <Fragment>
          <ModalHeader onClose={close}>
            <Text>
              <FormattedMessage
                id='modals.coinifyrecurringbuyconfirm.header'
                defaultMessage="You're About to Set Up A Recurring Order"
              />
            </Text>
          </ModalHeader>
          <ModalBody>
            <ButtonRow>
              <Button width='100px' onClick={close} nature='primary'>
                <FormattedMessage
                  id='modals.coinifytradedetails.kyc.close'
                  defaultMessage='Close'
                />
              </Button>
            </ButtonRow>
          </ModalBody>
        </Fragment>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state),
  canMakeRecurringTrade: getCanMakeRecurringTrade(state),
  subscriptions: selectors.core.data.coinify
    .getSubscriptions(state)
    .getOrElse([])
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch),
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
