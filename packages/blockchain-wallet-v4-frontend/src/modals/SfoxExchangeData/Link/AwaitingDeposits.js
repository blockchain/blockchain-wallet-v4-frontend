import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import { Image, Text, Button } from 'blockchain-info-components'
import PropTypes from 'prop-types'

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
`
const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  width: 60%;
  > div {
    margin: 15px 0px;
  }
`
const RightCol = styled.div`
  width: 40%;
  display: flex;
  justify-content: center;
`

const AwaitingDeposits = ({ showModal }) => {
  return (
    <Container>
      <LeftCol>
        <Text size='30px' weight={600}>
          <FormattedMessage id='awaiting_deposits.title' defaultMessage='Verify Your Bank Account' />
        </Text>
        <Image name='micro-deposits-whole' width='100%' />
        <Text size='13px' weight={300}>
          <FormattedMessage id='awaiting_deposits.body' defaultMessage='To verify your bank details, SFOX will send two micro-deposits to your bank account for a few cents each. Once received, select Enter Deposit Details to finish setting up your account.' />
        </Text>
        <Text size='13px' weight={300}>
          <FormattedMessage id='awaiting_deposits.note' defaultMessage='Bear with us: receiving these deposits can take up to 5 business days.' />
        </Text>
      </LeftCol>
      <RightCol>
        <Button uppercase width='80%' nature='primary' onClick={() => showModal('SfoxEnterMicroDeposits')}>
          <FormattedMessage id='awaiting_deposits.enter' defaultMessage='Enter Deposit Details' />
        </Button>
      </RightCol>
    </Container>
  )
}

AwaitingDeposits.propTypes = {
  showModal: PropTypes.func.isRequired
}

export default AwaitingDeposits
