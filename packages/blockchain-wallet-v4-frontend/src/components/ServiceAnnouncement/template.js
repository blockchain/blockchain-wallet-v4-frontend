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
const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  ${media.mobile`
    flex-direction: column;
    align-items: flex-start;
  `};
`
const Content = styled.div`
  flex: 2;
  width: 100%;
`
const Body = styled.div`
  ${media.mobile`
    display: none;
  `};
`
const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  & > :first-child {
    margin-right: 8px;
  }
`
const ActionLink = styled(Link)`
  white-space: nowrap;
  text-decoration: underline;
  & > :first-child {
    margin: 10px 0 6px;
  }
  ${media.mobile`
    margin: 0px;
  `};
`
const ActionIcon = styled(Icon)`
  margin-left: 10px;
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
        backgroundColor: 'info',
        textColor: 'white',
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
      <Wrapper>
        <Content>
          <Title>
            {announcement.icon && (
              <Icon name={announcement.icon} size='20px' color={textColor} />
            )}
            <Text size='14px' color='white' uppercase={uppercase}>
              {announcement.header[language]
                ? announcement.header[language]
                : announcement.header.en}
            </Text>
          </Title>
          <Body style={{ display: collapsed ? 'none' : '' }}>
            {announcement.sections.map((section, i) => {
              return (
                <Text
                  weight={300}
                  color={textColor}
                  key={i}
                  size='13px'
                  style={{ margin: '8px 0 0' }}
                >
                  {section.body[language]
                    ? section.body[language]
                    : section.body.en}
                </Text>
              )
            })}
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
          </Body>
        </Content>
      </Wrapper>
      <div>
        {announcement.hideType === 'collapse' && (
          <ActionIcon
            name={collapsed ? 'down-arrow' : 'up-arrow'}
            size='14px'
            weight={600}
            color='white'
            onClick={() => {
              toggleCollapse(announcement.id, collapsed)
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
