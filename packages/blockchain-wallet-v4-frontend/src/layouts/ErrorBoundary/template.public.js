import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Link, Icon, Text, TextGroup } from 'blockchain-info-components'

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: initial;
  max-width: 600px;
  padding: 18px;
  box-sizing: border-box;
  background-color: ${props => props.theme['white']};
  border: 1px solid ${props => props.theme['gray-1']};
  @media (max-width: 400px) {
    width: 100%;
    max-width: 400px;
  }
`
const SubText = styled(TextGroup)`
  margin-top: 14px;
  margin-bottom: 20px;
`
const LinkoutText = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`
const ErrorText = styled(Text)`
  font-size: 12px;
  @media (min-width: 480px) {
    font-size: 14px;
  }
`
const TitleGroup = styled(TextGroup)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`
const ErrorDetails = styled.details`
  white-space: pre-wrap;
  > summary {
    margin-bottom: 15px;
    &:hover { cursor: pointer; }
  }
`

const ErrorBoundary = (props) => {
  const { error, errorInfo, onGoToLogin } = props

  return (
    <Container>
      <Wrapper>
        <TitleGroup inline>
          <Icon name='alert-filled' size='24px' color='brand-primary' />
          <Text weight={300} size={'20px'} color='brand-primary' style={{ paddingLeft: '8px' }}>
            <FormattedMessage id='layout.errorboundary.title' defaultMessage='Something went terribly wrong!' />
          </Text>
        </TitleGroup>
        <SubText>
          <Text weight={300} size={'14px'} color='gray-5'>
            <FormattedMessage id='layout.errorboundary.subtitle1' defaultMessage="We're sorry, but something very unexpected has gone wrong. Please try again or contact support if the issue persists." />
          </Text>
        </SubText>
        <LinkoutText>
          <Link size='16px' weight={300} onClick={onGoToLogin} style={{margin: '0 auto'}}>
            <FormattedMessage id='layout.errorboundary.login' defaultMessage='Back to Login' />
          </Link>
        </LinkoutText>
        <ErrorText weight={300}>
          <ErrorDetails>
            <summary>Error Details</summary>
            {error && error.toString()}
            <br />
            {errorInfo.componentStack}
          </ErrorDetails>
        </ErrorText>
      </Wrapper>
    </Container>
  )
}

export default ErrorBoundary
