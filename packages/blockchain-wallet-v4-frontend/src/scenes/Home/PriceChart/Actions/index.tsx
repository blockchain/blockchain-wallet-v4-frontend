import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import { getData } from './selectors'
import Actions from './template'

const ActionsContainer = (props: Props) => {
  return <Actions {...props} />
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  simpleBuyActions: bindActionCreators(actions.components.simpleBuy, dispatch),
  swapActions: bindActionCreators(actions.components.swap, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

export type Props = ConnectedProps<typeof connector>

export default connector(ActionsContainer)
