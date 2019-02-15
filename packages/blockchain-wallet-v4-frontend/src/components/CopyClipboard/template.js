import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import CopyToClipBoard from 'react-copy-to-clipboard'

import { Button } from 'blockchain-info-components'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
`
const AddressBox = styled.span`
  display: block;
  width: 100%;
  height: 36px;
  font-size: 14px;
  font-weight: 300;
  overflow: hidden;
  line-height: 36px;
  padding-left: 10px;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${props => props.theme['gray-5']};
  font-family: 'Montserrat', Helvetica, sans-serif;
  background-color: ${props => props.theme['gray-1']};
`
const CopyButton = styled(Button)`
  width: 160px;
  min-width: 0;
  height: 100%;
  border-radius: 0;
`

const CopyClipboard = props => {
  const { active, address, handleClick } = props

  return (
    <Wrapper>
      <AddressBox data-e2e='copyClipboardAddress'>{address}</AddressBox>
      <CopyToClipBoard text={address} onCopy={handleClick}>
        <CopyButton
          nature={active ? 'success' : 'secondary'}
          data-e2e='copyClipboardCopyButton'
        >
          {active ? (
            <FormattedMessage
              id='components.copyclipboard.copied'
              defaultMessage='Copied!'
            />
          ) : (
            <FormattedMessage
              id='components.copyclipboard.copy'
              defaultMessage='Copy'
            />
          )}
        </CopyButton>
      </CopyToClipBoard>
    </Wrapper>
  )
}

CopyClipboard.propTypes = {
  active: PropTypes.bool.isRequired,
  address: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
}

export default CopyClipboard
