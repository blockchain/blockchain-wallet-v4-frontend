import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { getData } from './selectors'
import { bindActionCreators } from 'redux'
import Loading from './template.loading'
import Success from './template.success'
import Error from './template.error'
import { Wrapper } from 'components/Public'

class AuthorizeLogin extends React.PureComponent {
  constructor (props) {
    super(props)
    this.onAccept = this.onAccept.bind(this)
    this.onReject = this.onReject.bind(this)
    this.state = {
      token: decodeURIComponent(
        props.location.pathname.split('/authorize-approve/')[1]
      )
    }
  }

  componentDidMount () {
    this.props.miscActions.authorizeLogin(this.state.token)
  }

  onAccept (e) {
    e.preventDefault()
    this.props.miscActions.authorizeLogin(this.state.token, true)
  }

  onReject (e) {
    e.preventDefault()
    this.props.miscActions.authorizeLogin(this.state.token, false)
  }

  render () {
    const { data } = this.props

    let AuthorizeLoginStatus = data.cata({
      Success: value => (
        <Success
          value={value}
          onAccept={this.onAccept}
          onReject={this.onReject}
        />
      ),
      Failure: value => <Error value={value} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })

    return <Wrapper>{AuthorizeLoginStatus}</Wrapper>
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = dispatch => ({
  miscActions: bindActionCreators(actions.core.data.misc, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorizeLogin)
