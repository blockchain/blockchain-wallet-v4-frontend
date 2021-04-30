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
import { OwnProps, Props as _P, SuccessStateType } from '.'

type Props = OwnProps & SuccessStateType & _P

const Success = (props: Props) => {
  const media = props.account?.attributes?.media
  const logo = (media && media.length && media[0].source) || ''
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
          logo={logo as string}
          qrCode={props.account?.attributes?.qrcodeUrl as string}
        />
        <Hr />
        <Section>
          <LinkViaDesktop
            authUrl={props.account?.attributes?.authorisationUrl as string}
          />
          <BankWaitIndicator
            qrCode={props.account?.attributes?.qrcodeUrl as string}
          />
        </Section>
      </LinkOptionsWrapper>
    </BankWrapper>
  )
}

export default Success
