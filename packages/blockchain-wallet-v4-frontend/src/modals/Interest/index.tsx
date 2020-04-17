import { compose } from 'redux'
import { ModalPropsType } from '../types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import InterestForm from './InterestForm'
import modalEnhancer from 'providers/ModalEnhancer'
import React, { PureComponent } from 'react'

export type OwnProps = ModalPropsType

type Props = OwnProps

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
    const { position, total } = this.props
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
          <InterestForm handleClose={this.handleClose} />
        </FlyoutChild>
      </Flyout>
    )
  }
}

const enhance = compose<any>(
  modalEnhancer('INTEREST_MODAL', { transition: duration })
)

export default enhance(Interest)
