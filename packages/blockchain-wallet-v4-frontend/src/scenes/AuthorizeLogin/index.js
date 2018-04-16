import React from 'react'
import { actions } from 'data'
import { connect } from 'react-redux'
import { getData } from './selectors'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import Loading from './template.loading'
import Success from './template.success'
import Error from './template.error'

const Wrapper = styled.div`
  width: 100%;
  padding: 35px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};

  @media(min-width: 768px) { width: 550px; }
`

class AuthorizeLogin extends React.Component {
  componentDidMount () {
    const token = decodeURIComponent(this.props.location.pathname.split('/authorize-approve/')[1])
    this.props.miscActions.authorizeLogin(token)
  }

  onSubmit (e) {
    // e.preventDefault()
    // this.props.miscActions.authorizeLogin(token, true)
  }

  render () {
    const { data } = this.props

    let AuthorizeLoginStatus = data.cata({
      Success: (value) => <Success value={value} />,
      Failure: (value) => <Error value={value} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })

    return (
      <Wrapper>
        {AuthorizeLoginStatus}
      </Wrapper>
    )
  }
}

const mapStateToProps = state => ({
  data: getData(state)
})

const mapDispatchToProps = (dispatch) => ({
  miscActions: bindActionCreators(actions.core.data.misc, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(AuthorizeLogin)
