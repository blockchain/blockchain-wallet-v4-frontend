import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Image, Link, Text } from 'blockchain-info-components'
import { spacing } from 'services/StyleService'
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
  const { nextStep } = props

  return (
    <FirstStepContainer>
      <PrintContainer>
        <Text size='12px' weight={400}>
          <FormattedMessage id='modals.recoveryphrase.firststep.explain4' defaultMessage='We created a printable backup sheet to give you a place to write down your 12 word phrase and keep it safe. Please print the blank sheet (or grab a piece of paper) and move on to the next step.' />
        </Text>
        <Link href={recoveryPdf} download='recovery.pdf'>
          <Button nature='empty'>
            <Image name='printer' height='20px' width='20px' style={spacing('mr-5')} />
            <FormattedMessage id='modals.recoveryphrase.firststep.print' defaultMessage='Print Backup Sheet' />
          </Button>
        </Link>
      </PrintContainer>
      <Buttons>
        <Button nature='primary' onClick={nextStep}>
          <FormattedMessage id='modals.recoveryphrase.firststep.logout' defaultMessage='Get Phrase' />
        </Button>
      </Buttons>

    </FirstStepContainer>
  )
}

export default FirstStep
