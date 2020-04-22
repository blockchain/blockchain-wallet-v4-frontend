import { compose } from 'redux'
import { connect } from 'react-redux'
import { InterestModalName } from 'data/types'
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
  modalName: InterestModalName
}

type Props = OwnProps & LinkStatePropsType

type State = { direction: 'left' | 'right'; show: boolean }

class Interest extends PureComponent<Props, State> {
  state: State = { show: false, direction: 'left' }

  componentDidMount () {
    this.setState({ show: true }) //eslint-disable-line
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(this.props.close, duration)
  }

  render () {
    const { modalName, position, total } = this.props
    console.log(modalName)
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
        <FlyoutChild>
          {modalName === 'deposit' && (
            <InterestForm handleClose={this.handleClose} />
          )}
          {modalName === 'details' && (
            <InterestDetails handleClose={this.handleClose} />
          )}
        </FlyoutChild>
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  modalName: selectors.components.interest.getModalName(state)
})

const enhance = compose<any>(
  modalEnhancer('INTEREST_MODAL', { transition: duration }),
  connect(mapStateToProps)
)

export default enhance(Interest)
