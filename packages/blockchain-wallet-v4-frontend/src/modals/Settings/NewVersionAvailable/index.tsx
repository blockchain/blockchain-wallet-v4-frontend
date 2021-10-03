import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators, compose } from 'redux'

import { actions } from 'data'
import { ModalName } from 'data/types'
import modalEnhancer from 'providers/ModalEnhancer'

import NewVersionAvailable from './template'

class NewVersionAvailableContainer extends React.PureComponent<Props> {
  onSubmit = () => {
    this.props.authActions.logout()
    this.props.modalActions.closeModal()
  }

  render() {
    return <NewVersionAvailable {...this.props} onSubmit={this.onSubmit} />
  }
}

const mapDispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(actions.auth, dispatch),
  modalActions: bindActionCreators(actions.modals, dispatch)
})

const connector = connect(undefined, mapDispatchToProps)

const enhance = compose(
  modalEnhancer(ModalName.NEW_VERSION_AVAILABLE, { preventEscapeClose: true }),
  connector
)

type Props = ConnectedProps<typeof connector>

export default enhance(NewVersionAvailableContainer)
