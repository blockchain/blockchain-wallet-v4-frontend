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

class Reset2FAToken extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = { token: decodeURIComponent(props.location.pathname.split('/reset2fa-token/')[1]) }
  }

  componentDidMount () {
    this.props.miscActions.handle2FAReset(this.state.token)
  }

  render () {
    const { data } = this.props

    let Reset2FARequest = data.cata({
      Success: (value) => <Success value={value} />,
      Failure: (value) => <Error value={value} />,
      Loading: () => <Loading />,
      NotAsked: () => <Loading />
    })

    return (
      <Wrapper>
        {Reset2FARequest}
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

export default connect(mapStateToProps, mapDispatchToProps)(Reset2FAToken)
