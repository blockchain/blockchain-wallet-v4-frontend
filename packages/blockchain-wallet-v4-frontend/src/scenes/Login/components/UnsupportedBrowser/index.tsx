import React from 'react'
import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'

import { Banner } from 'blockchain-info-components'

const BrowserWarning = styled.div`
  margin-bottom: 10px;
`
const UnsupportedBrowser = (props: { isSupportedBrowser: boolean | undefined }) =>
  !props.isSupportedBrowser ? (
    <BrowserWarning>
      <Banner type='warning'>
        <FormattedMessage
          id='scenes.login.browserwarning'
          defaultMessage='Your browser is not supported. Please update to at least Chrome 45, Firefox 45, Safari 8, Edge, or Opera.'
        />
      </Banner>
    </BrowserWarning>
  ) : null

export default UnsupportedBrowser
