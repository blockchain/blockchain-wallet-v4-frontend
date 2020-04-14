import { actions } from 'data'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { RemoteDataType, SBCardType } from 'core/types'
import { RootState } from 'data/rootReducer'
import React, { PureComponent } from 'react'

type OwnProps = {
  cardId?: string
  handleClose: () => void
}
type SuccessStateType = {
  card: SBCardType
}
type LinkDispatchPropsType = {
  simpleBuyActions: typeof actions.components.simpleBuy
}
type LinkStatePropsType = {
  data: RemoteDataType<string, SuccessStateType>
}
type Props = OwnProps & LinkDispatchPropsType & LinkStatePropsType
type State = {}

class AddCard extends PureComponent<Props, State> {
  state = {}

  componentDidMount () {
    if (!this.props.cardId) {
      this.props.simpleBuyActions.createSBCard()
    }
  }

  render () {
    return <div>Add Card</div>
  }
}

const mapStateToProps = (state: RootState): LinkStatePropsType => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch: Dispatch): LinkDispatchPropsType => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCard)
