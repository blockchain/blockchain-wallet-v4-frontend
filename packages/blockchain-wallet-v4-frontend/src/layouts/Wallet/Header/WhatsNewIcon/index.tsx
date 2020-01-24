import { actions } from 'data'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { RemoteDataType } from 'data/types'
import React from 'react'
import WhatsNewIcon from './template'

type LinkStatePropsType = {
  data: RemoteDataType<string, { numOfNewAnnouncements: number }>
}

type LinkDispatchPropsType = {
  modalActions: typeof actions.modals
}

type Props = LinkStatePropsType & LinkDispatchPropsType

class WhatsNewIconContainer extends React.PureComponent<Props> {
  handleClick = () => {
    this.props.modalActions.showModal('WHATS_NEW_MODAL')
  }

  render () {
    return this.props.data.cata({
      Success: val => (
        <WhatsNewIcon
          onClick={this.handleClick}
          numOfNewAnnouncements={val.numOfNewAnnouncements}
        />
      ),
      Failure: () => <WhatsNewIcon />,
      Loading: () => <WhatsNewIcon />,
      NotAsked: () => <WhatsNewIcon />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  modalActions: bindActionCreators(actions.modals, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WhatsNewIconContainer)
