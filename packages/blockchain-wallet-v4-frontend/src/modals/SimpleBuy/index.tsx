import { actions } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { ModalPropsType } from '../types'
import { RootState } from 'data/rootReducer'
import Flyout, { duration, FlyoutChild } from 'components/Flyout'
import ModalEnhancer from 'providers/ModalEnhancer'
import React, { PureComponent } from 'react'

type OwnProps = ModalPropsType
type SuccessStateType = {}
type LinkDispatchPropsType = {
  simpleBuyActions: typeof actions.components.simpleBuy
}
type LinkStatePropsType = {}
type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
type State = {}

class SimpleBuy extends PureComponent<Props, State> {
  state = { show: false }

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
        onClose={this.handleClose}
        in={this.state.show}
        data-e2e='simpleBuyModal'
      >
        <FlyoutChild>simple buy</FlyoutChild>
      </Flyout>
    )
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const enhance = compose(
  ModalEnhancer('SIMPLE_BUY_MODAL', { transition: duration }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)

export default enhance(SimpleBuy)
