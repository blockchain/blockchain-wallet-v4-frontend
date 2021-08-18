import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Icon, Text } from 'blockchain-info-components'

import { ActionButton, CircleBackground } from '../../model'
import { Props as OwnProps } from '.'

const FormBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const ImportWallet = (props: Props) => {
  const { handleGoBackClick, handleImportNowClick } = props
  return (
    <>
      <FormBody>
        <CircleBackground color='blue600' size='40px'>
          <Icon name='request' color='white' size='20px' />
        </CircleBackground>
        <Text
          color='grey900'
          size='20px'
          weight={600}
          lineHeight='1.5'
          style={{ marginBottom: '8px' }}
        >
          <FormattedMessage id='scenes.recovery.import.title' defaultMessage='Import Your Wallet' />
        </Text>
        <Text
          color='grey900'
          size='16px'
          weight={500}
          lineHeight='1.5'
          style={{ textAlign: 'center' }}
        >
          <FormattedMessage
            id='scenes.recovery.import.body'
            defaultMessage='There’s no account associated with the seed phrase you entered. You can import and manage your wallet instead.'
          />
        </Text>
      </FormBody>
      <ActionButton
        nature='primary'
        fullwidth
        height='48px'
        data-e2e='resetAccountButton'
        style={{ marginBottom: '16px' }}
        onClick={handleImportNowClick}
      >
        <FormattedMessage id='buttons.import_now' defaultMessage='Import Now' />
      </ActionButton>
      <ActionButton
        nature='empty-blue'
        fullwidth
        height='48px'
        data-e2e='goBack'
        style={{ marginBottom: '16px' }}
        onClick={handleGoBackClick}
      >
        <FormattedMessage id='buttons.cancel_goback' defaultMessage='Cancel & Go Back' />
      </ActionButton>
    </>
  )
}

type Props = OwnProps & {
  handleGoBackClick: () => void
  handleImportNowClick: () => void
}

export default ImportWallet
