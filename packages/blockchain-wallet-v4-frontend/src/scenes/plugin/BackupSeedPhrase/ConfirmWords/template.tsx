import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Props } from 'blockchain-wallet-v4-frontend/src/modals/Settings/RecoveryPhrase/index'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import styled from 'styled-components'

import { Button, Link, Text } from 'blockchain-info-components'
import { Flex } from 'components/Flex'
import TextBox from 'components/Form/TextBox'
import { required } from 'services/forms'

import {
  BackIconWrapper,
  Bottom,
  CustomForm,
  InfoIconWrapper,
  TextWithMargins,
  WordContainer
} from '../model'

const WordContainerWrapper = styled.div`
  padding-top: 45px;
`

const TextWrapper = styled(Text)`
  width: 50%;
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
      <Flex alignItems='center' justifyContent='space-between'>
        <BackIconWrapper width={24} height={24} onClick={handleBackArrow} />
        <Link target='_blank' href='https://support.blockchain.com/hc/en-us/'>
          <InfoIconWrapper width={20} height={20} />
        </Link>
      </Flex>
      <TextWithMargins color='white' size='20px' weight={600}>
        <FormattedMessage
          id='modals.recoveryphrase.confirmwords.header'
          defaultMessage='Confirm Your Phrase'
        />
      </TextWithMargins>
      <Text color='grey400' size='14px' weight={500} lineHeight='150%'>
        <FormattedMessage
          id='plugin.modals.recoveryphrase.confirmwords.body'
          defaultMessage='Please enter your first and last words of your secret private key separated by a space.'
        />
      </Text>
      <Link size='14px' weight={500} target='_blank' href='https://support.blockchain.com/hc'>
        <FormattedMessage id='buttons.learn_more_arrow' defaultMessage='Learn more' />
      </Link>
      <WordContainerWrapper>
        {indexes.map((index) => (
          <WordContainer key={index}>
            <TextWrapper size='14px' weight={500} data-e2e='wordLabel' lineHeight='20px'>
              {`${languageHelper(index)} word`}
            </TextWrapper>
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
          nature={`${submitting || invalid ? 'grey800' : 'light'}`}
          color='white'
          size='16px'
          type='submit'
        >
          <Text color={`${submitting || invalid ? 'grey600' : 'grey900'}`} size='16px' weight={600}>
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Text>
        </Button>
      </Bottom>
    </CustomForm>
  )
}

export default reduxForm<{}, Props>({ form: 'confirmRecoveryWords' })(ConfirmWordsForm)
