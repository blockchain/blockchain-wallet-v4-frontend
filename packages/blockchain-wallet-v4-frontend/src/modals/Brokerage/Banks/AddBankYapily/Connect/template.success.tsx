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
} from '../../../../components'
import { OwnProps as _O, Props as _P, SuccessStateType as _SS } from '.'

type Props = _O & _SS & _P

const Success = (props: Props) => {
  return (
    <BankWrapper>
      <ModalNavWithCloseIcon {...props}>
        <FormattedMessage
          id='copy.connect_to_your_bank'
          defaultMessage='Connect to your bank'
        />
      </ModalNavWithCloseIcon>
      <LinkOptionsWrapper>
        <ScanWithPhone
          logo={props.account?.attributes.media[0].source as string}
          qrCode={props.account?.attributes.qrcodeUrl as string}
        />
        <Hr />
        <Section>
          <LinkViaDesktop
            authUrl={props.account?.attributes.authorisationUrl as string}
          />
          <BankWaitIndicator
            qrCode={props.account?.attributes.qrcodeUrl as string}
          />
        </Section>
      </LinkOptionsWrapper>
    </BankWrapper>
  )
}

export default Success
