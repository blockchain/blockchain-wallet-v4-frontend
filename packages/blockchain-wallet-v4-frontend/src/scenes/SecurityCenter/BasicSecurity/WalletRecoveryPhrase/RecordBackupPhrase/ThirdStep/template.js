import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm, Field } from 'redux-form'

import { spacing } from 'services/StyleService'
import { Button, Text } from 'blockchain-info-components'
import { Form, TextBox } from 'components/Form'
import { required } from 'services/FormHelper'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (min-width: 992px) {
    width: 118%;
  }
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 25px 0;
`
const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 15px 0;
`

const WordContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 60px;
  width: 125px;
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

const ThirdStep = props => {
  const { previousStep, submitting, invalid, ...rest } = props
  const { indexes, handleSubmit } = rest

  return (
    <Wrapper>
      <Form onSubmit={handleSubmit}>
        <Container>
          {indexes.map(index => (
            <WordContainer key={index}>
              <Text size='14px' weight={300} style={{ marginBottom: '4px' }}>
                {`${languageHelper(index)} word`}
              </Text>
              <Field
                name={`w${index}`}
                component={TextBox}
                validate={[required]}
                errorBottom
                noLastPass
              />
            </WordContainer>
          ))}
        </Container>
        <Buttons>
          <Button onClick={previousStep} nature='empty'>
            <Text weight={300} cursor='pointer'>
              <FormattedMessage
                id='scenes.securitycenter.walletrecoveryphrase.thirdstep.review'
                defaultMessage='Review Backup Phrase'
              />
            </Text>
          </Button>
          <Button
            type='submit'
            nature='primary'
            disabled={submitting || invalid}
            style={spacing('ml-15')}
          >
            <FormattedMessage
              id='scenes.securitycenter.walletrecoveryphrase.thirdstep.confirm'
              defaultMessage='Confirm'
            />
          </Button>
        </Buttons>
      </Form>
    </Wrapper>
  )
}

ThirdStep.propTypes = {
  indexes: PropTypes.array.isRequired,
  recoveryPhrase: PropTypes.array.isRequired,
  previousStep: PropTypes.func.isRequired,
  invalid: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  inline: PropTypes.bool.isRequired
}

export default reduxForm({ form: 'recoveryPhrase' })(ThirdStep)
