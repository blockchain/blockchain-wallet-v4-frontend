import { actions, selectors } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, ConnectedProps } from 'react-redux'
import { FiatType } from 'core/types'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'
import Template from './template'

class AddCard extends PureComponent<Props> {
  handleSubmit = () => {
    this.props.simpleBuyActions.addCardDetails()
  }

  render () {
    return <Template {...this.props} onSubmit={this.handleSubmit} />
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  fiatCurrency: selectors.components.simpleBuy.getFiatCurrency(state) || 'EUR'
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type OwnProps = {
  handleClose: () => void
}
type LinkDispatchPropsType = {
  simpleBuyActions: typeof actions.components.simpleBuy
}
type LinkStatePropsType = {
  fiatCurrency: FiatType
}
export type Props = OwnProps & ConnectedProps<typeof connector>

export default connect(mapStateToProps, mapDispatchToProps)(AddCard)
