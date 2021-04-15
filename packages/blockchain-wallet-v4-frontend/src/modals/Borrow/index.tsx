import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose, Dispatch } from 'redux'

import { LoanType, OfferType } from 'blockchain-wallet-v4/src/types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import { actions, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import modalEnhancer from 'providers/ModalEnhancer'

import { ModalPropsType } from '../types'
import AddCollateral from './AddCollateral'
import BorrowDetails from './BorrowDetails'
import BorrowForm from './BorrowForm'
import ConfirmBorrow from './ConfirmBorrow'
import RepayLoanForm from './RepayLoanForm'

type LinkStatePropsType =
  | {
      offer: OfferType
      step: 'CHECKOUT' | 'CONFIRM'
    }
  | {
      loan: LoanType
      offer: OfferType
      step: 'DETAILS' | 'ADD_COLLATERAL' | 'REPAY_LOAN'
    }

type LinkDispatchPropsType = {
  borrowActions: typeof actions.components.borrow
}
export type OwnProps = ModalPropsType

type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

type State = { show: boolean }

class Borrow extends PureComponent<Props, State> {
  state: State = { show: false }

  componentDidMount() {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(this.props.close, duration)
  }

  render() {
    const { position, total } = this.props
    return (
      <Flyout
        position={position}
        isOpen={this.state.show}
        userClickedOutside={this.props.userClickedOutside}
        onClose={this.handleClose}
        data-e2e='borrowModal'
        total={total}
      >
        {this.props.step === 'CHECKOUT' && (
          <FlyoutChild>
            <BorrowForm {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === 'CONFIRM' && (
          <FlyoutChild>
            <ConfirmBorrow {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === 'DETAILS' && (
          <FlyoutChild>
            <BorrowDetails {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === 'ADD_COLLATERAL' && (
          <FlyoutChild>
            <AddCollateral {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {this.props.step === 'REPAY_LOAN' && (
          <FlyoutChild>
            <RepayLoanForm {...this.props} handleClose={this.handleClose} />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  loan: selectors.components.borrow.getLoan(state),
  offer: selectors.components.borrow.getOffer(state),
  step: selectors.components.borrow.getStep(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  borrowActions: bindActionCreators(actions.components.borrow, dispatch)
})

const enhance = compose<any>(
  modalEnhancer('BORROW_MODAL', { transition: duration }),
  connect(mapStateToProps, mapDispatchToProps)
)

export default enhance(Borrow)
