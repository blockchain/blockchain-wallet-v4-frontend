import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import ui from 'redux-ui'

import { Remote } from 'blockchain-wallet-v4/src'
import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class EmailAddressContainer extends React.Component {
  constructor (props) {
    super(props)

    this.handleVerifyClick = this.handleVerifyClick.bind(this)
  }

  handleVerifyClick () {
    this.props.updateUI({ verifyToggled: !this.props.ui.verifyToggled })
  }

  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: (value) => <Success {...rest}
        data={value}
        handleVerifyClick={this.handleVerifyClick} />,
      Failure: (message) => <Error {...rest}
        message={message} />,
      Loading: () => <Loading {...rest} />,
      NotAsked: () => <Loading {...rest} />
    })
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  settingsActions: bindActionCreators(actions.modules.settings, dispatch),
  formActions: bindActionCreators(actions.form, dispatch)
})

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  ui({ key: 'Security_EmailAddress', state: { updateToggled: false, verifyToggled: false } })
)

export default enhance(EmailAddressContainer)
