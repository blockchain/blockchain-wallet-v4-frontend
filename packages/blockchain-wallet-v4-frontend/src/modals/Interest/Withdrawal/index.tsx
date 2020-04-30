import { compose } from 'redux'
import { ModalPropsType } from '../../types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import modalEnhancer from 'providers/ModalEnhancer'
import React, { PureComponent } from 'react'
import WithdrawalForm from './WithdrawalForm'

export type OwnProps = ModalPropsType

type Props = OwnProps

type State = { direction: 'left' | 'right'; show: boolean }

class Withdraw extends PureComponent<Props, State> {
  state: State = { show: false, direction: 'left' }

  componentDidMount () {
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ show: true })
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
        data-e2e='withdrawalModal'
        total={total}
      >
        <FlyoutChild>
          <WithdrawalForm handleClose={this.handleClose} />
        </FlyoutChild>
      </Flyout>
    )
  }
}

const enhance = compose<any>(
  modalEnhancer('WITHDRAWAL_MODAL', { transition: duration })
)

export default enhance(Withdraw)
