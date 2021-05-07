import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Icon, Image, Text } from 'blockchain-info-components'
import { FlyoutWrapper } from 'components/Flyout'

import { Props as _P, SuccessStateType } from '.'

type Props = _P & SuccessStateType

const Top = styled(FlyoutWrapper)`
  padding-bottom: 0px;
  position: relative;
  height: 100%;
  display: flex;
`

const CloseIcon = styled(Icon)`
  position: absolute;
  padding: inherit;
  left: 0px;
  top: 0px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled(Text)`
  margin: 56px 0 16px 0;
  text-align: center;
`

const Subcontent = styled(Text)`
  margin-bottom: 56px;
  text-align: center;
`

const Success: React.FC<Props> = props => {
  let bankName = ''
  if (props.yapilyBankId && props.bankCredentials?.attributes) {
    const bank = props.bankCredentials.attributes?.institutions.find(
      bank => bank.id === props.yapilyBankId
    )
    bankName = bank ? bank.fullName : ''
  }

  return (
    <Top>
      <CloseIcon
        cursor
        name='close'
        size='20px'
        color='grey600'
        role='button'
        onClick={props.handleClose}
      />
      <Wrapper>
        <Container>
          <Image width='100px' name='bank-success' />
          <Title color='grey800' size='20px' weight={600}>
            <FormattedMessage
              id='copy.bank_linked.title'
              defaultMessage='Bank Linked!'
            />
          </Title>
          <Subcontent color='grey600' weight={500}>
            {props.yapilyBankId ? (
              <FormattedMessage
                id='copy.bank_linked.name'
                defaultMessage='Your {bankName} account is now linked to your Blockchain.com Wallet'
                values={{ bankName }}
              />
            ) : (
              <FormattedMessage
                id='copy.bank_linked'
                defaultMessage='Your bank account is now linked to your Blockchain.com Wallet'
              />
            )}
          </Subcontent>

          <Button
            nature='primary'
            data-e2e='obContinueBankStatus'
            type='submit'
            fullwidth
            height='48px'
            onClick={() => props.handleClose()}
          >
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Button>
        </Container>
      </Wrapper>
    </Top>
  )
}

export default Success
