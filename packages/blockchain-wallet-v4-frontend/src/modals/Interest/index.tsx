import { compose } from 'redux'
import { connect } from 'react-redux'
import { InterestStep, InterestSteps } from 'data/types'
import { ModalPropsType } from '../types'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import InterestDetails from './InterestDetails'
import InterestForm from './InterestForm'
import modalEnhancer from 'providers/ModalEnhancer'
import React, { PureComponent } from 'react'

export type OwnProps = ModalPropsType

type LinkStatePropsType = {
  step: InterestStep
}

type Props = OwnProps & LinkStatePropsType

type State = { direction: 'left' | 'right'; show: boolean }

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
    setTimeout(this.props.close, duration)
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
            <InterestDetails handleClose={this.handleClose} />
          </FlyoutChild>
        )}
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  step: selectors.components.interest.getStep(state)
})

const enhance = compose<any>(
  modalEnhancer('INTEREST_MODAL', { transition: duration }),
  connect(mapStateToProps)
)

export default enhance(Interest)
