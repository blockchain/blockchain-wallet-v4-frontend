import React from 'react'
import { FormattedMessage } from 'react-intl'

import {
  BankWaitIndicator,
  BankWrapper,
  Hr,
  LinkOptionsWrapper,
  LinkViaDesktop,
  ModalNavWithCloseIcon,
  ScanWithPhone,
  Section
} from '../../components'
import { Props as _P, SuccessStateType as _SS } from '.'

type Props = _SS & _P

const Success = (props: Props) => {
  return (
    <BankWrapper>
      <ModalNavWithCloseIcon handleClose={props.handleClose}>
        <FormattedMessage
          id='copy.connect_to_your_bank'
          defaultMessage='Connect to your bank'
        />
      </ModalNavWithCloseIcon>
      <LinkOptionsWrapper>
        <ScanWithPhone qrCode={props.order?.attributes?.qrcodeUrl as string} />
        <Hr />
        <Section>
          <LinkViaDesktop
            authUrl={props.order?.attributes?.authorisationUrl as string}
          />
          <BankWaitIndicator
            qrCode={props.order?.attributes?.qrcodeUrl as string}
          />
        </Section>
      </LinkOptionsWrapper>
    </BankWrapper>
  )
}

export default Success
