import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Banner, Link, Text, TextGroup } from 'blockchain-info-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  z-index: 99;
  background-color: pink;
`

const Announcement = props => {
  const { announcement } = props
  return (
    <Wrapper>
      <Banner type={announcement.type} dismissible={true} collapsible={true}>
        <TextGroup style={{ padding: '0 10px'}}>
          <Text size='20px'>{announcement.header.en}</Text>
          {
            announcement.sections.map(section => {
              return <Text size='12px'>{section.body.en}</Text>
            })
          }
          <Link href={announcement.action.link} target='_blank' style={{marginLeft: 0}}>
            <Text size='14px'>{announcement.action.title.en}</Text>
          </Link>
        </TextGroup>
      </Banner>
    </Wrapper>
  )
}

Announcement.propTypes = {
  announcement: PropTypes.object.isRequired,
  handleDismiss: PropTypes.func.isRequired
}

export default Announcement
