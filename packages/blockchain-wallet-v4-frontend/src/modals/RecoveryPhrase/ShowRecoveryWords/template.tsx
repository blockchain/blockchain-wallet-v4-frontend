import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper, Title, Value } from 'components/Flyout'
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

const ContentContainer = styled.div``

const WordBox = styled.div`
  padding: 16px;
  border-top: 1px solid ${props => props.theme.grey000};
  display: flex;
  align-items: center;
`
const WordText = styled.div`
  padding-left: 20px;
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

const WordsList = ({ handleBackArrow, step, words }) => {
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
            onClick={handleBackArrow}
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
      {words.map((word, index) => {
        if (step === 'FIRST_SET_WORDS') {
          if (index < 6) {
            return (
              <WordBox>
                <WordText>
                  <Title>{index + 1}</Title>
                  <Value>{word}</Value>
                </WordText>
              </WordBox>
            )
          }
        }
        if (step === 'SECOND_SET_WORDS') {
          if (index >= 6) {
            return (
              <WordBox>
                <WordText>
                  <Title>{index + 1}</Title>
                  <Value>{word}</Value>
                </WordText>
              </WordBox>
            )
          }
        }
      })}
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

export default WordsList
