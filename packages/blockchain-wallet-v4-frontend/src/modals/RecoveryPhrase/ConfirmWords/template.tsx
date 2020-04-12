import { Button, Icon, Text } from 'blockchain-info-components'
import { Field } from 'redux-form'
import { FlyoutWrapper } from 'components/Flyout'
import { Form, TextBox } from 'components/Form'
import { FormattedMessage } from 'react-intl'
import { required } from 'services/FormHelper'
import React from 'react'
import styled from 'styled-components'

const CustomForm = styled(Form)`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`
const WordContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 80px;
  width: 100%;
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
const languageHelper = num => {
  switch (num) {
    case 0:
      return `${num + 1}st`
    case 1:
      return `${num + 1}nd`
    case 2:
      return `${num + 1}rd`
    default:
      return `${num + 1}th`
  }
}

const ConfirmWordsForm = ({
  handleBackArrow,
  submitting,
  invalid,
  indexes,
  onSubmit
}) => {
  return (
    <CustomForm onSubmit={onSubmit}>
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
              id='modals.recoveryphrase.confirmwords.header'
              defaultMessage='Confirm Your Phrase'
            />
          </Text>
        </Header>
        <Text color='grey600' weight={500}>
          <FormattedMessage
            id='modals.recoveryphrase.confirmwords.body'
            defaultMessage='Please enter the words that match the numbers you see below.'
          />
        </Text>
        {indexes.map(index => (
          <WordContainer key={index}>
            <Text size='14px' weight={400} data-e2e='wordLabel'>
              {`${languageHelper(index)} word`}
            </Text>
            <Field
              component={TextBox}
              data-e2e='wordInput'
              disableSpellcheck
              errorBottom
              name={`w${index}`}
              noLastPass
              validate={[required]}
            />
          </WordContainer>
        ))}
        <ButtonWrapper>
          <Button
            capitalize
            data-e2e='toRecoveryTwo'
            disabled={submitting || invalid}
            fullwidth
            height='48px'
            nature='primary'
            size='16px'
            type='submit'
          >
            <FormattedMessage
              id='modals.recoveryphrase.confirmwords.body'
              defaultMessage='Confirm'
            />
          </Button>
        </ButtonWrapper>
      </FlyoutWrapper>
    </CustomForm>
  )
}

export default ConfirmWordsForm
