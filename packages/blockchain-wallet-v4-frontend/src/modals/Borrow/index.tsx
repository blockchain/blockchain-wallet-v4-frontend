import { actions, selectors } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { BorrowStepsType } from 'data/types'
import { connect } from 'react-redux'
import { LoanType, OfferType } from 'core/types'
import { RootState } from 'data/rootReducer'
import BorrowForm from './BorrowForm'
import Flyout, { duration } from 'components/Flyout'
import modalEnhancer from 'providers/ModalEnhancer'
import React, { PureComponent } from 'react'

type LinkStatePropsType = {
  step: BorrowStepsType
}

type LinkDispatchPropsType = {
  borrowActions: typeof actions.components.borrow
}
type OwnProps = {
  close: () => void
  loan?: LoanType
  offer?: OfferType
  position: number
  total: number
  userClickedOutside: boolean
}

type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

class Borrow extends PureComponent<Props> {
  state = { show: false }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  componentWillUnmount () {
    this.props.borrowActions.setStep('CHECKOUT')
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
        userClickedOutside={this.props.userClickedOutside}
        onClose={this.handleClose}
        data-e2e='borrowModal'
        total={total}
      >
        {this.props.step === 'CHECKOUT' && <BorrowForm {...this.props} />}
        {this.props.step === 'DETAILS' && (
          <div>{JSON.stringify(this.props.loan)}</div>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
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
