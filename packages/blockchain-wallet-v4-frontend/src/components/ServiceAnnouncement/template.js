import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Link, Icon, Text, TextGroup } from 'blockchain-info-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: ${props => props.theme[props.color]};
  border: 2px solid ${props => props.theme[props.color]};
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  margin: 0 auto;
  overflow: hidden;
  height: ${props => props.collapsed ? '35px' : ''};
  width: 100%;
`
const ActionLink = styled(Link)`
  margin-left: 0;
  margin-top: 0;
  color: blue;
  text-decoration: underline;
`
const ActionIcon = styled(Icon)`
  &:hover {
    cursor: pointer;
  }
`
const IconContainer = styled.div`
  margin: 0 25px;
`

const selectStyle = type => {
  switch (type) {
    case 'danger': return { color: 'brand-yellow', uppercase: true, icon: 'alert' }
    case 'info': return { color: 'brand-tertiary', uppercase: false, icon: null }
    case 'warning': return { color: 'error', uppercase: false, icon: 'alert' }
    default: return { color: 'brand-tertiary', uppercase: false, icon: null }
  }
}

const Announcement = props => {
  const { announcement, collapsed, handleDismiss, toggleCollapse } = props
  const style = selectStyle(announcement.type)
  const { color, uppercase, icon } = style

  return (
    <Container color={color} collapsed={collapsed}>
      <IconContainer>
        { icon && <Icon name={icon} size='24px' weight={600} color={color} /> }
      </IconContainer>
      <div style={{width: '100%'}}>
        <Text weight={300} size='20px' uppercase={uppercase} style={{margin: '6px 0'}}>{announcement.header.en}</Text>
        <TextGroup style={{ display: collapsed ? 'none' : '' }}>
          {
            announcement.sections.map(section => {
              return <Text size='13px' style={{marginBottom: '2px'}}>{section.body.en}</Text>
            })
          }
          <ActionLink href={announcement.action.link} target='_blank'>
            <Text color='brand-primary' size='14px'>{announcement.action.title.en}</Text>
          </ActionLink>
        </TextGroup>
      </div>
      <IconContainer>
        { announcement.hideType === 'collapse' && <ActionIcon name={collapsed ? 'down-arrow' : 'up-arrow'} size='18px' weight={600} onClick={toggleCollapse} /> }
        { announcement.hideType === 'dismiss' && <ActionIcon name='close' size='18px' weight={600} onClick={handleDismiss} /> }
      </IconContainer>
    </Container>
  )
}

Announcement.propTypes = {
  announcement: PropTypes.object.isRequired,
  handleDismiss: PropTypes.func.isRequired
}

export default Announcement
