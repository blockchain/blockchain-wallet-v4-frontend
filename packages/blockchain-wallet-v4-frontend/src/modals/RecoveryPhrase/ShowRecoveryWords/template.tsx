import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
`

const ContentContainer = styled.div`
  margin-bottom: 50px;
`

const ButtonWrapper = styled(FlyoutWrapper)`
  padding-top: 0px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  margin-top: 5px;
  & > :first-child {
    margin-bottom: 15px;
  }
`

const FirstSetWords = () => {
  return (
    <Wrapper>
      <FlyoutWrapper>
        <Header>
          <Icon
            cursor
            name='arrow-left'
            size='20px'
            color='grey600'
            style={{ marginRight: '24px' }}
            role='button'
          />
          <Text color='grey800' size='20px' weight={600}>
            <FormattedMessage
              id='modals.recoveryphrase.firstsetwords.header'
              defaultMessage='Recovery Phrase'
            />
          </Text>
        </Header>
        <ContentContainer>
          <Text color='grey600' weight={500}>
            <FormattedMessage
              id='modals.recoveryphrase.firstsetwords.header'
              defaultMessage='Carefully write down these 12 words in order. Do not email or screenshot your recovery phrase. '
            />
          </Text>
        </ContentContainer>
      </FlyoutWrapper>
      <ButtonWrapper>
        <Button
          capitalize
          data-e2e='toRecoveryTwo'
          fullwidth
          height='48px'
          nature='primary'
          size='16px'
        >
          <FormattedMessage
            id='modals.recoveryphrase.firstsetwords.nextbutton'
            defaultMessage='Next'
          />
        </Button>
      </ButtonWrapper>
    </Wrapper>
  )
}

export default FirstSetWords
