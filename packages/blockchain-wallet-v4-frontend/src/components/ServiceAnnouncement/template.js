import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Link, Icon, Text, TextGroup } from 'blockchain-info-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  background: ${props => props.theme[props.color]};
  border: 1px solid ${props => props.theme[props.color]};
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  margin: 0 auto;
  overflow: hidden;
  height: ${props => props.collapsed ? '26px' : ''};
  width: 100%;
  padding: 5px 10px;
  & > span:first-child { margin-right: ${props => props.inline ? '3px' : '5px'} };
`
const ActionIcon = styled(Icon)`
  margin-top: 5px;
  &:hover {
    cursor: pointer;
  }
`

const selectStyle = type => {
  switch (type) {
    case 'success': return { color: 'success', uppercase: false, icon: 'checkmark-in-circle' }
    case 'warning': return { color: 'error', uppercase: true, icon: 'alert' }
    case 'alert': return { color: 'brand-secondary', uppercase: false, icon: 'bell' }
    case 'caution': return { color: 'brand-yellow', uppercase: false, icon: 'alert' }
    case 'info': return { color: 'brand-tertiary', uppercase: false, icon: null }
    default: return { color: 'brand-tertiary', uppercase: false, icon: null }
  }
}

const Announcement = props => {
  const { announcement, collapsed, handleDismiss, toggleCollapse } = props
  const style = selectStyle(announcement.type)
  const { color, uppercase, icon } = style
  const dismissible = true
  const collapsible = true

  return (
    <Container color={color} collapsed={collapsed}>
      <Icon name='bell' size='14px' weight={600} />
      { icon && <Icon name={icon} size='18px' weight={600} color={color} /> }
      <div>
        <Text size='20px' uppercase={uppercase}>{announcement.header.en}</Text>
        <TextGroup style={{ display: collapsed ? 'none' : '' }}>
          {
            announcement.sections.map(section => {
              return <Text size='13px'>{section.body.en}</Text>
            })
          }
          <Link href={announcement.action.link} target='_blank' style={{marginLeft: 0, color: 'blue'}}>
            <Text color='brand-primary' size='14px'>{announcement.action.title.en}</Text>
          </Link>
        </TextGroup>
      </div>
      { collapsible && <ActionIcon name={collapsed ? 'down-arrow' : 'up-arrow'} size='14px' weight={600} onClick={toggleCollapse} /> }
      { dismissible && <ActionIcon name='close' size='14px' weight={600} onClick={handleDismiss} /> }
    </Container>
  )
}

Announcement.propTypes = {
  announcement: PropTypes.object.isRequired,
  handleDismiss: PropTypes.func.isRequired
}

export default Announcement
