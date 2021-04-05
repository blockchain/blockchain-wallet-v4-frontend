import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { actions } from 'data'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class CaptchaBoxContainer extends React.PureComponent {
  constructor(props) {
    super(props)
    this.fetchNewCaptcha = this.fetchNewCaptcha.bind(this)
  }

  componentDidMount() {
    this.props.actions.fetchCaptcha()
  }

  fetchNewCaptcha() {
    this.props.actions.fetchCaptcha()
  }

  render() {
    const { data } = this.props

    return data.cata({
      Success: value => (
        <Success
          captchaUrl={value.url}
          fetchNewCaptcha={this.fetchNewCaptcha}
          {...this.props}
        />
      ),
      Failure: message => <Error>{message}</Error>,
      NotAsked: () => <Loading />,
      Loading: () => <Loading />
    })
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(actions.core.data.misc, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CaptchaBoxContainer)
