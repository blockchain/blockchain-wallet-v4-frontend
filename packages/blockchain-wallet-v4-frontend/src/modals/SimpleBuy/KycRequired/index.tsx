import { actions } from 'data'
import { bindActionCreators, compose, Dispatch } from 'redux'
import { connect } from 'react-redux'
import React, { PureComponent } from 'react'
import Template from './template'

export type OwnProps = {
  handleClose: () => void
}

export type LinkDispatchPropsType = {
  identityVerificationActions: typeof actions.components.identityVerification
  simpleBuyActions: typeof actions.components.simpleBuy
}

type LinkStatePropsType = {}
type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
type State = {}

class KycRequired extends PureComponent<Props, State> {
  state = {}

  render () {
    return <Template {...this.props} />
  }
}

const mapStateToProps = (): LinkStatePropsType => ({})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  identityVerificationActions: bindActionCreators(
    actions.components.identityVerification,
    dispatch
  )
})

const enhance = compose(connect(mapStateToProps, mapDispatchToProps))

export default enhance(KycRequired)
