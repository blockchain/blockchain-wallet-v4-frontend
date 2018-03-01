import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { reduxForm } from 'redux-form'

import { Button, Link, Icon, Text } from 'blockchain-info-components'
import { Form } from 'components/Form'
import WordInput from './WordInput'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`
const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  button {
    margin-bottom: 40px;
  }
  a:first-of-type {
    margin-bottom: 10px;
  }
`
const SuccessOverlay = styled.div`
  width: 90%;
  padding: 0px 20px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: ${props => props.authType ? 'flex' : 'none'};
  position: absolute;
  left: 0px;
  z-index: 1;
`
const VerificationContainer = styled.div`
  opacity: ${props => props.authType ? 0.3 : 1};
`

const ThirdStep = (props) => {
  const { previousStep, position, showSuccess, close, submitting, invalid, phrase, goBackOnSuccess, inline, handleClose, ...rest } = props
  const { indexes, onSubmit, isMnemonicVerified } = rest
  return (
    <Form onSubmit={onSubmit}>
      <SuccessOverlay authType={showSuccess && isMnemonicVerified}>
        <Icon name='checkmark-in-circle' size='150px' color='success' />
        <Text size='14px' weight={300} color='success'>
          <FormattedMessage id='scenes.security.backupphrase.verified' defaultMessage="Congrats! You've successfully verified your Backup Phrase!" />
        </Text>
      </SuccessOverlay>
      <VerificationContainer authType={showSuccess && isMnemonicVerified}>
        <Container>
          {indexes.indexOf(0) > -1 && <WordInput index={0} phrase={phrase} />}
          {indexes.indexOf(1) > -1 && <WordInput index={1} phrase={phrase} />}
          {indexes.indexOf(2) > -1 && <WordInput index={2} phrase={phrase} />}
          {indexes.indexOf(3) > -1 && <WordInput index={3} phrase={phrase} />}
          {indexes.indexOf(4) > -1 && <WordInput index={4} phrase={phrase} />}
          {indexes.indexOf(5) > -1 && <WordInput index={5} phrase={phrase} />}
          {indexes.indexOf(6) > -1 && <WordInput index={6} phrase={phrase} />}
          {indexes.indexOf(7) > -1 && <WordInput index={7} phrase={phrase} />}
          {indexes.indexOf(8) > -1 && <WordInput index={8} phrase={phrase} />}
          {indexes.indexOf(9) > -1 && <WordInput index={9} phrase={phrase} />}
          {indexes.indexOf(10) > -1 && <WordInput index={10} phrase={phrase} />}
          {indexes.indexOf(11) > -1 && <WordInput index={11} phrase={phrase} />}
        </Container>
        <Buttons>
          <Button type='submit' nature='primary' disabled={submitting || invalid}>
            <FormattedMessage id='modals.recoveryphrase.thirdstep.confirm' defaultMessage='Confirm' />
          </Button>
          {
            invalid
              ? <Link size='12px' weight={300} onClick={previousStep}>
                <FormattedMessage id='modals.recoveryphrase.thirdstep.doublecheck' defaultMessage='Double check your backup phrase' />
              </Link>
              : null
          }
          <Link size='12px' weight={300} onClick={inline ? handleClose : goBackOnSuccess}>
            <FormattedMessage id='modals.recoveryphrase.thirdstep.skipfornow' defaultMessage="Skip for now, I'll do this later" />
          </Link>
        </Buttons>
      </VerificationContainer>
    </Form>
  )
}

ThirdStep.propTypes = {
  indexes: PropTypes.array.isRequired,
  phrase: PropTypes.array.isRequired,
  previousStep: PropTypes.func.isRequired,
  goBackOnSuccess: PropTypes.func,
  invalid: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  inline: PropTypes.bool.isRequired
}

export default reduxForm({ form: 'recoveryPhrase' })(ThirdStep)
