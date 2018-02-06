import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux'
import { actions } from 'data'
import ui from 'redux-ui'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class TwoStepVerificationContainer extends React.Component {
  constructor (props) {
    super(props)

    this.handleClick = this.handleClick.bind(this)
    this.chooseMethod = this.chooseMethod.bind(this)

    this.state = { authMethod: '' }
  }
  handleClick () {
    this.props.updateUI({ verifyToggled: !this.props.ui.verifyToggled })
  }

  chooseMethod (method) {
    this.setState({ authMethod: method })
  }

  render () {
    const { data, ...rest } = this.props

    return data.cata({
      Success: (value) => <Success {...rest}
        authType={value}
        handleClick={this.handleClick}
        chooseMethod={this.chooseMethod}
        twoStepChoice={this.state.authMethod}
        />,
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
  ui({ key: 'Security_TwoStep', state: { verifyToggled: false } })
)

export default enhance(TwoStepVerificationContainer)
// export default connect(mapStateToProps)(TwoStepVerificationContainer)
