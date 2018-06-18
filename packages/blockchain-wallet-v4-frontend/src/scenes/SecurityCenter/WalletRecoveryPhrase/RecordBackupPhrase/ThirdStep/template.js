import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm, Field } from 'redux-form'
import { toLower, equals } from 'ramda'

import { Button, Link, Icon, Text } from 'blockchain-info-components'
import { Form, TextBox } from 'components/Form'
import { SuccessOverlay } from 'components/Security'
import { required } from 'services/FormHelper'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 75%;
  margin: 0 auto;
`
const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  button {
    margin-bottom: 20px;
  }
`
const VerificationContainer = styled.div`
  width: 118%;
  opacity: ${props => props.authType ? 0.3 : 1};
`

const WordContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 60px;
  width: 100px;
  div:first-of-type {
    margin-bottom: 30px;
  }
`
const WordError = styled.label`
  position: absolute;
  top: ${props => props.errorBottom ? '35px' : '60px'};
  right: 0;
  display: block;
  height: 15px;
  font-size: 12px;
  font-weight: 300;
  color: ${props => props.theme['error']};
`

const validateWord = index => (value, allValues, props) => {
  console.info(value, allValues, props, index)
  return equals(toLower(value), toLower(props.recoveryPhrase[index])) ? undefined : <WordError errorBottom={props.errorBottom}>Invalid</WordError>
}

const languageHelper = (num) => {
  switch (num) {
    case 0: return `${num + 1}st`
    case 1: return `${num + 1}nd`
    case 2: return `${num + 1}rd`
    default: return `${num + 1}th`
  }
}

const ThirdStep = (props) => {
  const { previousStep, showSuccess, recoveryPhrase, submitting, invalid, ...rest } = props
  const { indexes, handleSubmit, isMnemonicVerified } = rest

  return (
    <Form onSubmit={handleSubmit}>
      <SuccessOverlay success={showSuccess && isMnemonicVerified}>
        <Icon name='checkmark-in-circle' size='150px' color='success' />
        <Text size='14px' weight={300} color='success'>
          <FormattedMessage id='scenes.securitycenter.walletrecoveryphrase.thirdstep.verified' defaultMessage="Congrats! You've successfully verified your Backup Phrase!" />
        </Text>
      </SuccessOverlay>
      <VerificationContainer authType={showSuccess && isMnemonicVerified}>
        <Container>
          {indexes.map(index =>
            <WordContainer>
              <Text size='13px' weight={300}>
                {`${languageHelper(index)} word`}
              </Text>
              <Field name={`word${index}`} component={TextBox} validate={[required]} center />
            </WordContainer>
          )}
        </Container>
        <Buttons>
          <Button type='submit' nature='primary' disabled={submitting || invalid}>
            <FormattedMessage id='scenes.securitycenter.walletrecoveryphrase.thirdstep.confirm' defaultMessage='Confirm' />
          </Button>
          {/*{*/}
            {/*invalid*/}
              {/*? <Link size='12px' weight={300} onClick={previousStep}>*/}
                {/*<FormattedMessage id='scenes.securitycenter.walletrecoveryphrase.thirdstep.doublecheck' defaultMessage='Double check your backup phrase' />*/}
              {/*</Link>*/}
              {/*: null*/}
          {/*}*/}
        </Buttons>
      </VerificationContainer>
    </Form>
  )
}

ThirdStep.propTypes = {
  indexes: PropTypes.array.isRequired,
  recoveryPhrase: PropTypes.array.isRequired,
  previousStep: PropTypes.func.isRequired,
  goBackOnSuccess: PropTypes.func,
  invalid: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  inline: PropTypes.bool.isRequired
}

export default reduxForm({ form: 'recoveryPhrase' })(ThirdStep)
