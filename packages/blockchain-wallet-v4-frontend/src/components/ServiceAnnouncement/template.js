import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import media from 'services/ResponsiveService'
import { Link, Icon, Text } from 'blockchain-info-components'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${props => props.theme[props.backgroundColor]};
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  margin: 0 auto;
  overflow: hidden;
  padding: 10px 25px;
  box-sizing: border-box;
  height: ${props => (props.collapsed ? '35px' : '')};
  width: 100%;
`
const AnnouncementWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${media.mobile`
    flex-direction: column;
    align-items: flex-start;
  `};
`
const AnnouncementContent = styled.div`
  flex: 2;
`
const AnnouncementBody = styled.div`
  ${media.mobile`
    display: none;
  `};
`
const ActionLink = styled(Link)`
  margin: 0 20px;
  white-space: nowrap;
  text-decoration: underline;
  ${media.mobile`
    margin: 0px;
  `};
`
const ActionIcon = styled(Icon)`
  &:hover {
    cursor: pointer;
  }
`

const selectStyle = type => {
  switch (type) {
    case 'danger':
      return {
        backgroundColor: 'error',
        textColor: 'white',
        uppercase: true
      }
    case 'info':
      return {
        backgroundColor: 'textBlack',
        textColor: 'gray-2',
        uppercase: false
      }
    default:
      return {
        backgroundColor: 'textBlack',
        textColor: 'gray-2',
        uppercase: false
      }
  }
}

const Announcement = props => {
  const {
    announcement,
    collapsed,
    language,
    handleDismiss,
    toggleCollapse
  } = props
  const style = selectStyle(announcement.type)
  const { backgroundColor, textColor, uppercase } = style

  return (
    <Container collapsed={collapsed} backgroundColor={backgroundColor}>
      <AnnouncementWrapper>
        <AnnouncementContent style={{ width: '100%' }}>
          <Text size='14px' color='white' uppercase={uppercase}>
            {announcement.header[language]
              ? announcement.header[language]
              : announcement.header.en}
          </Text>
          <AnnouncementBody style={{ display: collapsed ? 'none' : '' }}>
            {announcement.sections.map((section, i) => {
              return (
                <Text
                  weight={300}
                  color={textColor}
                  key={i}
                  size='13px'
                  style={{ margin: '5px 0px 0px 0px' }}
                >
                  {section.body[language]
                    ? section.body[language]
                    : section.body.en}
                </Text>
              )
            })}
          </AnnouncementBody>
        </AnnouncementContent>
        <ActionLink
          href={announcement.action.link}
          color={textColor}
          target='_blank'
        >
          <Text weight={400} color={textColor} size='14px'>
            {announcement.action.title[language]
              ? announcement.action.title[language]
              : announcement.action.title.en}
          </Text>
        </ActionLink>
      </AnnouncementWrapper>
      <div>
        {announcement.hideType === 'collapse' && (
          <ActionIcon
            name={collapsed ? 'down-arrow' : 'up-arrow'}
            size='14px'
            weight={600}
            color='white'
            onClick={() => {
              toggleCollapse(announcement.id)
            }}
          />
        )}
        {announcement.hideType === 'dismiss' && (
          <ActionIcon
            name='close'
            size='14px'
            weight={600}
            color='white'
            onClick={() => {
              handleDismiss(announcement.id)
            }}
          />
        )}
      </div>
    </Container>
  )
}

Announcement.propTypes = {
  announcement: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
  handleDismiss: PropTypes.func.isRequired
}

export default Announcement
