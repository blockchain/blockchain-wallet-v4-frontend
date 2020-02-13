import { actions, selectors } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { BorrowStepsType } from 'data/types'
import { connect } from 'react-redux'
import { LoanType, OfferType } from 'core/types'
import { RootState } from 'data/rootReducer'
import BorrowDetails from './BorrowDetails'
import BorrowForm from './BorrowForm'
import Flyout, { duration } from 'components/Flyout'
import modalEnhancer from 'providers/ModalEnhancer'
import React, { PureComponent } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import styled from 'styled-components'

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

const Foo = styled.div`
  width: 100%;
  height: 100%;

  .example-enter {
    top: 0;
    left: 99%;
    opacity: 0.01;
    position: absolute;
  }

  .example-enter.example-enter-active {
    opacity: 1;
    left: 0;
    transition: opacity 500ms ease-in, left 500ms;
  }

  .example-leave {
    position: absolute;
    opacity: 1;
    left: 0;
    top: 0;
  }

  .example-leave.example-leave-active {
    left: -99%;
    opacity: 0.01;
    transition: opacity 500ms ease-in, left 500ms;
  }
`

type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType

class Borrow extends PureComponent<Props> {
  state = { show: false }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
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
        <Foo>
          <ReactCSSTransitionGroup
            transitionName='example'
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
          >
            {this.props.step === 'CHECKOUT' && this.props.offer && (
              <BorrowForm offer={this.props.offer} />
            )}
            {this.props.step === 'DETAILS' && this.props.loan && (
              <BorrowDetails loan={this.props.loan} />
            )}
            {this.props.step === 'ADD_COLLATERAL' && <h1>here</h1>}
          </ReactCSSTransitionGroup>
        </Foo>
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
