import { actions, selectors } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { InterestStep, InterestSteps } from 'data/types'
import { ModalPropsType } from '../types'
import { RootState } from 'data/rootReducer'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import InterestDetails from './InterestDetails'
import InterestForm from './InterestForm'
import modalEnhancer from 'providers/ModalEnhancer'
import React, { PureComponent } from 'react'

class Interest extends PureComponent<Props, State> {
  state: State = { show: false, direction: 'left' }

  componentDidMount () {
    this.setState({ show: true }) //eslint-disable-line
  }

  componentDidUpdate (prevProps: Props) {
    if (this.props.step === prevProps.step) return
    if (InterestSteps[this.props.step] > InterestSteps[prevProps.step]) {
      /* eslint-disable */
      this.setState({ direction: 'left' })
    } else {
      this.setState({ direction: 'right' })
      /* eslint-enable */
    }
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  handleSBClick = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
      this.props.simpleBuyActions.showModal('sideNav')
    }, duration / 2)
  }

  render () {
    const { step, position, total } = this.props
    return (
      <Flyout
        position={position}
        in={this.state.show}
        direction={this.state.direction}
        userClickedOutside={this.props.userClickedOutside}
        onClose={this.handleClose}
        data-e2e='interestModal'
        total={total}
      >
        {step === 'DEPOSIT' && (
          <FlyoutChild>
            <InterestForm handleClose={this.handleClose} />
          </FlyoutChild>
        )}
        {step === 'DETAILS' && (
          <FlyoutChild>
            <InterestDetails
              handleClose={this.handleClose}
              handleSBClick={this.handleSBClick}
            />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  step: selectors.components.interest.getStep(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(
  mapStateToProps,
  mapDispatchToProps
)

type OwnProps = ModalPropsType
type LinkStatePropsType = {
  step: InterestStep
}
type LinkDispatchPropsType = {
  simpleBuyActions: typeof actions.components.simpleBuy
}
type State = { direction: 'left' | 'right'; show: boolean }
type Props = OwnProps & ConnectedProps<typeof connector>

const enhance = compose<any>(
  modalEnhancer('INTEREST_MODAL', { transition: duration }),
  connector
)

export default enhance(Interest)
