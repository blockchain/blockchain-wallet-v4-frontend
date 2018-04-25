import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, IconButton, Link, Text } from 'blockchain-info-components'
import recoveryPdf from './recovery.pdf'

const PrintContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  div:first-of-type {
    padding-right: 30px;
  }
  width: 65%;
`
const FirstStepContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 118%;
`
const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  a {
    margin-top: 15px;
  }
`

const FirstStep = (props) => {
  const { nextStep, goBackOnSuccess } = props

  return (
    <FirstStepContainer>
      <PrintContainer>
        <Text size='12px' weight={400}>
          <FormattedMessage id='modals.recoveryphrase.firststep.explain4' defaultMessage='We have created a printable Backup Sheet to give you a place to write down your Backup Phrase and keep it safe. Please print the blank sheet (or grab a piece of paper) and move on to the next step.' />
        </Text>
        <Link href={recoveryPdf} download='recovery.pdf'>
          <IconButton name='paper-airplane-outlined' nature='empty'>
            <FormattedMessage id='modals.recoveryphrase.firststep.print' defaultMessage='Print Recovery Sheet' />
          </IconButton>
        </Link>
      </PrintContainer>
      <Buttons>
        <Button nature='primary' onClick={nextStep}>
          <FormattedMessage id='modals.recoveryphrase.firststep.logout' defaultMessage='Start Backup Phrase' />
        </Button>
        <Link size='12px' weight={300} onClick={props.inline ? props.handleClose : goBackOnSuccess}>
          <FormattedMessage id='modals.recoveryphrase.firststep.cancel' defaultMessage="Skip for now, I'll do this later" />
        </Link>
      </Buttons>
    </FirstStepContainer>
  )
}

export default FirstStep
