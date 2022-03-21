import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Button, Image, Text } from 'blockchain-info-components'
import { ImageType } from 'blockchain-info-components/src/Images/Images'
import { FlyoutContainer, FlyoutContent, FlyoutFooter } from 'components/Flyout/Layout'
import { BankStatusType } from 'data/types'

import { getAddBankStatusText } from '../model'

const Title = styled(Text)`
  margin: 56px 0 16px 0;
  text-align: center;
`

const Subcontent = styled(Text)`
  margin-bottom: 56px;
  text-align: center;
`
const AddBankError = ({ bankStatus, handleClose, retryAction }: Props) => {
  const { image, text, title } = getAddBankStatusText(bankStatus)
  return (
    <FlyoutContainer>
      <FlyoutContent mode='middle'>
        <div style={{ padding: '0 40px', textAlign: 'center' }}>
          <Image width='100px' name={image as keyof ImageType} />
          <Title color='grey800' size='20px' weight={600}>
            {title}
          </Title>
          <Subcontent color='grey600' weight={500}>
            {text}
          </Subcontent>
        </div>
      </FlyoutContent>
      <FlyoutFooter collapsed>
        {bankStatus === BankStatusType.ACTIVE ? (
          <Button
            nature='primary'
            data-e2e='obContinueBankStatus'
            fullwidth
            height='48px'
            onClick={handleClose}
          >
            <FormattedMessage id='buttons.continue' defaultMessage='Continue' />
          </Button>
        ) : (
          <>
            <Button
              data-e2e='bankLinkTryAgain'
              height='48px'
              size='16px'
              nature='primary'
              onClick={retryAction}
              fullwidth
            >
              {bankStatus === BankStatusType.BANK_TRANSFER_ACCOUNT_EXPIRED ? (
                <FormattedMessage
                  id='copy.try_another_method'
                  defaultMessage='Try another method'
                />
              ) : (
                <FormattedMessage id='buttons.tryagain' defaultMessage='Try Again' />
              )}
            </Button>
            {bankStatus !== BankStatusType.BANK_TRANSFER_ACCOUNT_INVALID &&
              bankStatus !== BankStatusType.BANK_TRANSFER_ACCOUNT_ALREADY_LINKED &&
              bankStatus !== BankStatusType.BANK_TRANSFER_ACCOUNT_NOT_SUPPORTED && (
                <Button
                  data-e2e='bankLinkCancel'
                  height='48px'
                  size='16px'
                  nature='light'
                  style={{ marginTop: '16px' }}
                  onClick={handleClose}
                  fullwidth
                >
                  <FormattedMessage id='buttons.cancel_goback' defaultMessage='Cancel & Go Back' />
                </Button>
              )}
          </>
        )}
      </FlyoutFooter>
    </FlyoutContainer>
  )
}

type Props = {
  bankStatus: BankStatusType
  handleClose: () => void
  retryAction: () => void
}

export { AddBankError }
export default AddBankError
