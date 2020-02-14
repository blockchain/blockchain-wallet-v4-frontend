import { actions, model, selectors } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { BorrowStepsType } from 'data/types'
import { connect } from 'react-redux'
import { LoanType, OfferType, RemoteDataType } from 'core/types'
import { RootState } from 'data/rootReducer'
import AddCollateral from './AddCollateral'
import BorrowDetails from './BorrowDetails'
import BorrowForm from './BorrowForm'
import Flyout, { duration } from 'components/Flyout'
import modalEnhancer from 'providers/ModalEnhancer'
import React, { PureComponent } from 'react'

const { BORROW_STEPS } = model.components.borrow

type LinkStatePropsType = {
  loan?: LoanType
  offer?: OfferType
  step: BorrowStepsType
}

type LinkDispatchPropsType = {
  borrowActions: typeof actions.components.borrow
}
type OwnProps = {
  close: () => void
  position: number
  total: number
  userClickedOutside: boolean
}

type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

type State = { direction: 'left' | 'right'; show: boolean }

class Borrow extends PureComponent<Props, State> {
  state: State = { show: false, direction: 'left' }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  componentDidUpdate (prevProps) {
    if (this.props.step === prevProps.step) return
    if (BORROW_STEPS[this.props.step] > BORROW_STEPS[prevProps.step]) {
      /* eslint-disable */
      this.setState({ direction: 'left' })
    } else {
      this.setState({ direction: 'right' })
      /* eslint-enable */
    }
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(this.props.close, duration)
  }

  render () {
    const { position, total } = this.props
    return (
      <Flyout
        position={position}
        in={this.state.show}
        direction={this.state.direction}
        userClickedOutside={this.props.userClickedOutside}
        onClose={this.handleClose}
        data-e2e='borrowModal'
        total={total}
      >
        {this.props.step === 'CHECKOUT' && this.props.offer && (
          <BorrowForm offer={this.props.offer} />
        )}
        {this.props.step === 'DETAILS' && this.props.loan && (
          <BorrowDetails loan={this.props.loan} />
        )}
        {this.props.step === 'ADD_COLLATERAL' && this.props.loan && (
          <AddCollateral loan={this.props.loan} />
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  loan: selectors.components.borrow.getLoan(state),
  offer: selectors.components.borrow.getOffer(state),
  step: selectors.components.borrow.getStep(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  borrowActions: bindActionCreators(actions.components.borrow, dispatch)
})

const enhance = compose(
  modalEnhancer('BORROW_MODAL', { transition: duration }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(Borrow)
