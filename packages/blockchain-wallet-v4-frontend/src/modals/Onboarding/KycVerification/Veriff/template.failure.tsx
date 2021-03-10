import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Link, Text } from 'blockchain-info-components'
import { media } from 'services/styles'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 70px;
  width: 100%;

  ${media.mobile`
    margin-top: 35px;
  `}
`
const Title = styled(Text)`
  margin: 32px 0 38px 0;
  width: 100%;
  line-height: 37px;
`
const Content = styled.div`
  margin-bottom: 54px;
  max-width: 428px;
  width: 100%;
  line-height: 24px;

  > div:first-child {
    margin-bottom: 32px;
  }
`
const ContinueButton = styled(Button)`
  margin: 42px 20px 0;
  max-width: 400px;
`
const ServerErrorText = styled(Text)`
  margin-top: 42px;
`

const Failure: React.FC<{
  message?: { message: string | Error }
  onClose: () => void
}> = props => {
  return (
    <Wrapper data-e2e='veriffFailureContainer'>
      <Image name='gold-notice' width='70' height='66' />
      <Title color='black' size='24px' weight={600}>
        <FormattedMessage
          id='identityverification.failure.header'
          defaultMessage='Gold Unavailable At This Time'
        />
      </Title>
      <Content>
        <Text color='grey800' size='14px'>
          <FormattedMessage
            id='identityverification.failure.content1'
            defaultMessage="We're sorry but we can't verify you for Gold at this time. This can be for a number of reasons, for example your country might not be supported right now. If you're Silver verified you can still Buy, Sell or Swap a limited amount of crypto now."
          />
        </Text>
        <Text color='grey800' size='14px'>
          <FormattedMessage
            id='identityverification.failure.content2'
            defaultMessage='If you want to learn more about our verification process. Visit our'
          />{' '}
          <Link
            href='https://support.blockchain.com/'
            size='14px'
            target='_blank'
            weight={500}
          >
            <FormattedMessage
              id='identityverification.failure.link'
              defaultMessage='Support Center'
            />
          </Link>
          {'.'}
        </Text>
        <ServerErrorText color='red500' size='14px' weight={500}>
          <FormattedMessage
            id='identityverification.failure.error'
            defaultMessage='Server Error: {description}'
            values={props.message}
          />
        </ServerErrorText>
      </Content>
      <ContinueButton
        jumbo
        data-e2e='kycCloseModal'
        fullwidth
        nature='primary'
        onClick={props.onClose}
      >
        <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
      </ContinueButton>
    </Wrapper>
  )
}

export default Failure
