import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { FlyoutWrapper } from 'components/Flyout'
import { LoanType } from 'core/types'
import React, { Component } from 'react'

type LinkDispatchPropsType = {
  borrowActions: typeof actions.components.borrow
}
type OwnProps = {
  loan: LoanType
}
type Props = OwnProps & LinkDispatchPropsType
type State = {}

export class AddCollateral extends Component<Props, State> {
  state = {}

  render () {
    return (
      <FlyoutWrapper
        onClick={() =>
          this.props.borrowActions.setStep({
            step: 'DETAILS',
            loan: this.props.loan
          })
        }
      >
        Go Back
      </FlyoutWrapper>
    )
  }
}

const mapStateToProps = state => ({})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  borrowActions: bindActionCreators(actions.components.borrow, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCollateral)
