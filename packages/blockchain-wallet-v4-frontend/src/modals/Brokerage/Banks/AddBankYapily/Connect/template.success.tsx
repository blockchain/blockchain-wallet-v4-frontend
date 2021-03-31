import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

import {
  BankWrapper,
  Hr,
  LinkViaDesktop,
  ModalNavWithCloseIcon,
  ScanWithPhone
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
      <ScanWithPhone
        logo={props.account?.attributes.media[0].source as string}
        qrCode={props.account?.attributes.qrcodeUrl as string}
      />
      <Text weight={600} size='16px' color='grey900'>
        <Hr />
      </Text>
      <LinkViaDesktop
        authUrl={props.account?.attributes.authorisationUrl as string}
      />
    </BankWrapper>
  )
}

export default Success
