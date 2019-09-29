import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import {
  Button,
  Image,
  Link,
  Text,
  TextGroup
} from 'blockchain-info-components'
import media from 'services/ResponsiveService'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 20px;
  margin-top: 70px;
  width: 100%;
  ${media.mobile`
    margin-top: 35px;
  `}
`

const Title = styled(Text)`
  margin: 32px 0 38px 0;
  max-width: 520px;
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

const StartTrading = styled(Button)`
  margin-bottom: 42px;
  height: 56px;
  max-width: 200px;
  width: 100%;
`

const FooterContent = styled(TextGroup)`
  max-width: 450px;
  width: 100%;
  line-height: 24px;
`

const ServerErrorText = styled(Text)`
  margin-top: 42px;
`

const Verify = ({ message, onClose }) => {
  return (
    <Wrapper>
      <Image name='gold-notice' width='70' height='66' />
      <Title color='black' size='30px' weight={600}>
        <FormattedMessage
          id='identityverification.failure.header'
          defaultMessage='Gold Unavailable At This Time'
        />
      </Title>
      <Content>
        <Text>
          <FormattedMessage
            id='identityverification.failure.content-1'
            defaultMessage="We're sorry we can't verify you for Gold. This can be for a number of reasons, for example your country might not be supported right now."
          />
        </Text>
        <Text>
          <FormattedMessage
            id='identityverification.failure.content-2'
            defaultMessage="If you're Silver verified you can trade your crypto in Swap"
          />
        </Text>
        <ServerErrorText weight={500}>
          <FormattedMessage
            id='identityverification.failure.server.error'
            defaultMessage='Server Error: {description}'
            values={message}
          />
        </ServerErrorText>
      </Content>
      <StartTrading nature='primary' onClick={onClose}>
        <FormattedMessage
          id='identityverification.failure.button'
          defaultMessage='Start Trading'
        />
      </StartTrading>
      <FooterContent>
        <Text>
          <FormattedMessage
            id='identityverification.failure.content-3'
            defaultMessage='If you want to learn more about our verification process. Visit our '
          />
          <Link
            href='https://support.blockchain.com/'
            target='_blank'
            weight={400}
          >
            <FormattedMessage
              id='identityverification.failure.content-3-link'
              defaultMessage='Support Center.'
            />
          </Link>
        </Text>
      </FooterContent>
    </Wrapper>
  )
}

export default Verify
