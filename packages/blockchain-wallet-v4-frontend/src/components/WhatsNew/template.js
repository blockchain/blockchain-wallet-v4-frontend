import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { Text, TextGroup, ModalHeader, ModalBody } from 'blockchain-info-components'
import PropTypes from 'prop-types'
import Announcements from './WhatsNewContent'

const Fragment = React.Fragment

const Wrapper = styled.div`
  box-sizing: border-box;
  overflow: none;
`

const WhatsNewTitle = styled(Text)`
  box-sizing: border-box;
  overflow: none;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  margin-top: 15px;

`
const WhatsNewDate = styled(Text)`
  box-sizing: border-box;
  overflow: none;
`

const WhatsNewContent = styled(Text)`
box-sizing: border-box;
overflow: none;
`
const WhatsNewLink = styled(Text)`
box-sizing: border-box;
overflow: none;
`

const ContentWrapper = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
`
const WhatsNew = (props) => {
  const { handleTrayRightToggle } = props

  return (
    <Fragment>
      <ModalHeader onClose={() => handleTrayRightToggle()}>
        <FormattedMessage id='layouts.wallet.trayright.whatsnew' defaultMessage='Whats New'/>
      </ModalHeader>
      <ModalBody>
        <Wrapper>
          <ContentWrapper>
            {Announcements.map((item, i) => {
              const { title, desc, date, link } = item
              return (
                <Fragment key={i}>
                  <div>
                    <WhatsNewTitle size='14px' weight={600}>{title}</WhatsNewTitle>
                    <WhatsNewDate color='gray-3' weight={400} size='12px'>{date}</WhatsNewDate>
                  </div>
                  <TextGroup inline>
                    <WhatsNewContent size='12px' weight={300}>{desc}</WhatsNewContent>
                    <WhatsNewLink>{link}</WhatsNewLink>
                  </TextGroup>
                </Fragment>
              )
            })}
          </ContentWrapper>
        </Wrapper>
      </ModalBody>
    </Fragment>
  )
}

WhatsNew.propTypes = {
  handleTrayRightToggle: PropTypes.func.isRequired
}

export default WhatsNew
