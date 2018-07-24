import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'
import { Button, Link, Icon, Text } from 'blockchain-info-components'
import { Form } from 'components/Form'
import WordInput from './WordInput'
import { SuccessOverlay } from 'components/Security'

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

const ThirdStep = (props) => {
  const { previousStep, showSuccess, submitting, invalid, ...rest } = props
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
          {indexes.map(index => <WordInput index={index} />)}
        </Container>
        <Buttons>
          <Button type='submit' nature='primary' disabled={submitting || invalid}>
            <FormattedMessage id='scenes.securitycenter.walletrecoveryphrase.thirdstep.confirm' defaultMessage='Confirm' />
          </Button>
          {
            invalid
              ? <Link size='12px' weight={300} onClick={previousStep}>
                <FormattedMessage id='scenes.securitycenter.walletrecoveryphrase.thirdstep.doublecheck' defaultMessage='Double check your backup phrase' />
              </Link>
              : null
          }
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
