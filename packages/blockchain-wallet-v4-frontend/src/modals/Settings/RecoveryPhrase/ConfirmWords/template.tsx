import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Icon, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'
import { Form, TextBox } from 'components/Form'
import { required } from 'services/forms'

import { Props } from '../index'

const CustomForm = styled(Form)`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`

const HeaderWrapper = styled(FlyoutWrapper)`
  padding-bottom: 32px;
`
const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`
const Separator = styled.div`
  border: solid 0.5px ${(props) => props.theme.grey000};
`
const WordContainerWrapper = styled(FlyoutWrapper)`
  padding-top: 24px;
`
const WordContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 80px;
  width: 100%;
  margin-bottom: 15px;
`

const Bottom = styled(FlyoutWrapper)`
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
`
const languageHelper = (num) => {
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

const ConfirmWordsForm: React.FC<InjectedFormProps<{}, Props> & Props> = (props) => {
  const { handleBackArrow, indexes, invalid, submitting, ...rest } = props
  const { handleSubmit } = rest
  return (
    <CustomForm onSubmit={handleSubmit}>
      <HeaderWrapper>
        <Header>
          <Icon
            cursor
            data-e2e='recoveryBackArrow'
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
      </HeaderWrapper>
      <Separator />
      <WordContainerWrapper>
        {indexes.map((index) => (
          <WordContainer key={index}>
            <Text size='14px' weight={500} data-e2e='wordLabel' lineHeight='20px'>
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
      </WordContainerWrapper>
      <Bottom>
        <Button
          capitalize
          data-e2e='confirmButton'
          disabled={submitting || invalid}
          fullwidth
          height='48px'
          nature='primary'
          size='16px'
          type='submit'
        >
          <FormattedMessage
            id='modals.recoveryphrase.confirmwords.button'
            defaultMessage='Confirm'
          />
        </Button>
      </Bottom>
    </CustomForm>
  )
}

export default reduxForm<{}, Props>({ form: 'confirmRecoveryWords' })(ConfirmWordsForm)
