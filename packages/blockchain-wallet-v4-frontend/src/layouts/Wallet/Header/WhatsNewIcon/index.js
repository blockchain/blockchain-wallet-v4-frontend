import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'
import { getData } from './selectors'
import WhatsNewIcon from './template'

class WhatsNewIconContainer extends React.PureComponent {
  render () {
    return (
      <WhatsNewIcon
        highlighted={this.props.highlighted}
        handleClick={() => this.props.actions.layoutWalletWhatsnewClicked()}
      />
    )
  }
}

const mapStateToProps = state => getData(state)

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.components.layoutWallet, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(WhatsNewIconContainer)
