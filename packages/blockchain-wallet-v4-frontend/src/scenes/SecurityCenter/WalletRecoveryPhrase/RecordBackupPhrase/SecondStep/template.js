import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Button, Link, Text } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  padding: 25px 0;
`
const Word = styled(Text)`
  font-size: 14px;
  padding: 15px;
  border: 1px solid #DDDDDD;
  border-radius: 4px;
  width: 100px;
  text-align: center;
`
const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 0px;
  a {
    margin-top: 50px;
  }
`

const SecondStep = (props) => {
  const { nextStep, handleClickNext, goBackOnSuccess, step, words } = props
  return (
    <Wrapper>
      <Container>
        {
          words.map((word, index) => {
            return (
              <Word key={index}>
                {word}
              </Word>
            )
          })
        }
      </Container>
      <Buttons>
        {
          step === 3
            ? <Button onClick={nextStep} nature='primary'>
              <Text color='white' weight={300} cursor='pointer'>
                <FormattedMessage id='modals.recoveryphrase.firststep.finishandcheckphrase' defaultMessage='Finish & Check your Backup Phrase' />
              </Text>
            </Button>
            : <Button onClick={handleClickNext} nature='dark'>
              <Text color='white' weight={300} cursor='pointer'>
                <FormattedMessage id='modals.recoveryphrase.firststep.nextfourwords' defaultMessage='Next 4 Words' />
              </Text>
            </Button>
        }
        <Link size='12px' weight={300} onClick={props.inline ? props.handleClose : goBackOnSuccess}>
          <FormattedMessage id='modals.recoveryphrase.firststep.cancel' defaultMessage="Skip for now, I'll do this later" />
        </Link>
      </Buttons>
    </Wrapper>
  )
}

export default SecondStep
