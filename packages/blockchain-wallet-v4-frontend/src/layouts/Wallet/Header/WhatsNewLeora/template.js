import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Icon, ModalHeader, ModalBody } from 'blockchain-info-components'
import PropTypes from 'prop-types'

const Fragment = React.Fragment

const Wrapper = styled.div`
  box-sizing: border-box;
  overflow: none;
`

const ContentWrapper = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
`
const WhatsNewLeora = (props) => {
  const {handleTrayRightToggle} = props

  return (
    <Fragment>
      <ModalHeader onClose={handleTrayRightToggle}>
        <FormattedMessage id='layouts.wallet.trayright.whatsNew' defaultMessage='Whats New'/>
      </ModalHeader>
      <ModalBody>
        <Wrapper>
          <ContentWrapper>
            <div>Hello</div>
          </ContentWrapper>
        </Wrapper>
      </ModalBody>
    </Fragment>
  )
}

WhatsNewLeora.propTypes = {
  handleTrayRightToggle: PropTypes.func.isRequired
}

export default WhatsNewLeora
