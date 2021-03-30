import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Text } from 'blockchain-info-components'

import {
  BankWrapper,
  Hr,
  LinkViaDesktop,
  ModalNavWithCloseIcon,
  ScanWithPhone
} from '../../components'
import { Props as _P, SuccessStateType as _SS } from '.'

type Props = _SS & _P

const Success = (props: Props) => {
  return (
    <BankWrapper>
      <ModalNavWithCloseIcon>
        <FormattedMessage
          id='copy.connect_to_your_bank'
          defaultMessage='Connect to your bank'
        />
      </ModalNavWithCloseIcon>
      <ScanWithPhone qrCode={props.order?.attributes?.qrcodeUrl as string} />
      <Text weight={600} size='16px' color='grey900'>
        <Hr />
      </Text>
      <LinkViaDesktop
        authUrl={props.order?.attributes?.authorisationUrl as string}
      />
    </BankWrapper>
  )
}

export default Success
