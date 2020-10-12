import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

import { actions } from 'data'
import { ExtractSuccess } from 'core/types'
import { getData } from './selectors'
import { ModalPropsType } from '../types'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import ModalEnhancer from 'providers/ModalEnhancer'

class Swap extends PureComponent<Props, State> {
  state: State = { show: false, direction: 'left' }

  componentDidMount () {
    /* eslint-disable */
    this.setState({ show: true })
    /* eslint-enable */
  }

  handleClose = () => {
    this.setState({ show: false })
    setTimeout(() => {
      this.props.close()
    }, duration)
  }

  render () {
    return (
      <Flyout
        {...this.props}
        in={this.state.show}
        direction={this.state.direction}
        onClose={this.handleClose}
      >
        <FlyoutChild>Swap</FlyoutChild>
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  swapActions: bindActionCreators(actions.components.swap, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

const enhance = compose(
  ModalEnhancer('SWAP_MODAL', { transition: duration }),
  connector
)

type OwnProps = {}
export type SuccessStateType = ExtractSuccess<ReturnType<typeof getData>>
export type Props = ModalPropsType & OwnProps & ConnectedProps<typeof connector>
type State = { direction: 'left' | 'right'; show: boolean }

export default enhance(Swap)
