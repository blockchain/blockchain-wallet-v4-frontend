import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { bindActionCreators } from 'redux'

import { Wrapper } from 'components/Public'
import { actions } from 'data'

import { getData } from './selectors'
import Error from './template.error'
import Loading from './template.loading'
import Success from './template.success'

class AuthorizeLogin extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props)
    this.onAccept = this.onAccept.bind(this)
    this.onReject = this.onReject.bind(this)
    this.state = {
      token: decodeURIComponent(props.location.pathname.split('/authorize-approve/')[1])
    }
  }

  componentDidMount() {
    this.props.miscActions.authorizeLogin(this.state.token)
  }

  onAccept(e) {
    e.preventDefault()
    this.props.miscActions.authorizeLogin(this.state.token, true)
  }

  onReject(e) {
    e.preventDefault()
    this.props.miscActions.authorizeLogin(this.state.token, false)
  }

  render() {
    const { data } = this.props

    const AuthorizeLoginStatus = data.cata({
      Failure: (value) => <Error value={value} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />,
      Success: (value) => (
        <Success value={value} onAccept={this.onAccept} onReject={this.onReject} />
      )
    })

    return <Wrapper>{AuthorizeLoginStatus}</Wrapper>
  }
}

const mapStateToProps = (state) => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  miscActions: bindActionCreators(actions.core.data.misc, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector>

type State = {
  token: string
}

export default connector(AuthorizeLogin)
