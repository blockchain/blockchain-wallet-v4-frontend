import React from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'

import { Icon, SpinningLoader, Text } from 'blockchain-info-components'
import { Wrapper as SceneWrapper } from 'components/Public'
import { actions, selectors } from 'data'

import Success from './AuthorizeLogin.template.success'

const NonSuccessWrapper = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  flex-direction: column;
`

const Loading = () => (
  <NonSuccessWrapper>
    <SpinningLoader width='40px' height='40px' />
    <Text size='16px' weight={400} style={{ marginTop: '24px' }}>
      <FormattedMessage
        id='scenes.authorizelogin.verifying'
        defaultMessage="We're verifying your authorization attempt. Please wait..."
      />
    </Text>
  </NonSuccessWrapper>
)

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
    const { data, miscActions } = this.props
    const { token } = this.state

    return (
      <SceneWrapper>
        <Success
          value={{
            approver_cc: 'BE',
            approver_country: 'Belgium',
            approver_device_description: 'Chrome',
            approver_ip: '10.35.0.21',
            device_change_reason: 'Browser User Agent Changed',
            guid: '5bf36a85-1e1b-4e90-a60b-02c852286e3c',
            requester_cc: 'BE',
            requester_country: 'Belgium',
            requester_device_description: 'Safari',
            requester_ip: '10.35.0.21',
            success: null
          }}
          onAccept={() => miscActions.authorizeLogin(token, true)}
          onReject={() => miscActions.authorizeLogin(token, false)}
        />
      </SceneWrapper>
    )

    return (
      <SceneWrapper>
        {data.cata({
          Failure: (error) => (
            <NonSuccessWrapper>
              <Icon color='error' name='close-circle' size='40px' />
              <Text size='20px' weight={600} color='black' style={{ marginTop: '8px' }}>
                <FormattedMessage id='copy.oops' defaultMessage='Oops. Something went wrong.' />
              </Text>
              <Text style={{ margin: '8px 0 12px 0' }} size='16px' color='red600' weight={500}>
                <FormattedMessage
                  id='scenes.authorizelogin.error.msg'
                  defaultMessage='Error: {error}'
                  values={{ error }}
                />
              </Text>
              <LinkContainer to='/login'>
                <Text color='blue600' size='16px' weight={500} cursor='pointer'>
                  <FormattedMessage id='copy.try_again' defaultMessage='Try Again' />
                </Text>
              </LinkContainer>
            </NonSuccessWrapper>
          ),
          Loading: () => <Loading />,
          NotAsked: () => <Loading />,
          Success: (value) => (
            <Success
              value={value}
              onAccept={() => miscActions.authorizeLogin(token, true)}
              onReject={() => miscActions.authorizeLogin(token, false)}
            />
          )
        })}
      </SceneWrapper>
    )
  }
}

const mapStateToProps = (state) => ({
  data: selectors.core.data.misc.authorizeLogin(state)
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
