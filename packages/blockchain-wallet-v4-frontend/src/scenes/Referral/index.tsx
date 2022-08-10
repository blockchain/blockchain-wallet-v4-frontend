import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import { selectors } from 'data'

import Referral from './Referral.template'

const ReferralContainer = ({ referralInformation }: Props) => {
  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false)
  const handleCopyToClipboard = () => {
    if (!referralInformation) return

    navigator.clipboard.writeText(referralInformation.code)
    setCopiedToClipboard(true)

    setTimeout(() => {
      setCopiedToClipboard(false)
    }, 2000)
  }

  if (!referralInformation) return null

  return (
    <Referral
      copiedToClipboard={copiedToClipboard}
      handleCopyToClipboard={handleCopyToClipboard}
      {...referralInformation}
    />
  )
}

const mapStateToProps = (state) => ({
  referralInformation: selectors.components.referral.getReferralInformation(state)
})

const connector = connect(mapStateToProps)
type Props = ConnectedProps<typeof connector>

export default connector(ReferralContainer)
