import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper, Title, Value } from 'components/Flyout'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`

const WordBox = styled.div`
  padding: 16px;
  border-top: 1px solid ${props => props.theme.grey000};
  display: flex;
  align-items: center;
`
const WordText = styled.div`
  padding-left: 20px;
`

const Bottom = styled(FlyoutWrapper)`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  height: 100%;
`

const WordsList = ({ handleBackArrow, handleNextButton, step, words }) => {
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
            data-e2e='recoveryBackArrow'
          />
          <Text color='grey800' size='20px' weight={600}>
            <FormattedMessage
              id='modals.recoveryphrase.firstsetwords.header_new'
              defaultMessage='Secret Private Key Recovery Phrase'
            />
          </Text>
        </Header>
        <Text color='grey600' weight={500}>
          <FormattedMessage
            id='modals.recoveryphrase.firstsetwords.body_new'
            defaultMessage='Carefully write down these 12 words in order. Do not email or screenshot your Secret Private Key Recovery Phrase.'
          />
        </Text>
      </FlyoutWrapper>
      {step === 'FIRST_SET_WORDS' &&
        words.map((word, index) => {
          if (index < 6) {
            return (
              <WordBox>
                <WordText data-e2e='backupWords'>
                  <Title>{index + 1}</Title>
                  <Value>{word}</Value>
                </WordText>
              </WordBox>
            )
          }
        })}
      {step === 'SECOND_SET_WORDS' &&
        words.map((word, index) => {
          if (index >= 6) {
            return (
              <WordBox>
                <WordText data-e2e='backupWords'>
                  <Title>{index + 1}</Title>
                  <Value>{word}</Value>
                </WordText>
              </WordBox>
            )
          }
        })}
      <Bottom>
        <Button
          capitalize
          data-e2e='toRecoveryTwo'
          fullwidth
          height='48px'
          nature='primary'
          size='16px'
          onClick={handleNextButton}
        >
          <FormattedMessage
            id='modals.recoveryphrase.firstsetwords.nextbutton'
            defaultMessage='Next'
          />
        </Button>
      </Bottom>
    </Wrapper>
  )
}

export default WordsList
