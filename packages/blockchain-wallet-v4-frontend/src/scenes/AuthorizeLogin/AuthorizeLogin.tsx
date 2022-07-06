import React, { useEffect, useState } from 'react'
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

const AuthorizeLogin: React.FC<Props> = ({ data, location, miscActions }) => {
  const [token] = useState(location.pathname.split('/authorize-approve/')[1])
  useEffect(() => {
    miscActions.authorizeLogin(token)
  }, [token])

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
        Success: (data) => (
          <Success
            data={data}
            onAccept={() => miscActions.authorizeLogin(token, true)}
            onReject={() => miscActions.authorizeLogin(token, false)}
          />
        )
      })}
    </SceneWrapper>
  )
}

const mapStateToProps = (state) => ({
  data: selectors.core.data.misc.authorizeLogin(state)
})

const mapDispatchToProps = (dispatch) => ({
  miscActions: bindActionCreators(actions.core.data.misc, dispatch)
})

const connector = connect(mapStateToProps, mapDispatchToProps)

type Props = ConnectedProps<typeof connector> & { location: { pathname: string } }

export default connector(AuthorizeLogin)
