import React from 'react'
import { storiesOf, addDecorator } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'
import { withInfo, setDefaults } from '@storybook/addon-info'

import Welcome from './welcome.js'
import Page from './myPage.js'
import { Button, PrimaryButton, SecondaryButton, ButtonGroup, ConfirmationGauge,
          Icon, SimpleDropdown, Link, Modal, Separator, Tooltip,
          Text, TextGroup } from '../src'

addDecorator(story => (<Page>{story()}</Page>))
addDecorator((story, context) => withInfo('Documentation')(story)(context))


// Set default settings for addon-info
setDefaults({
  inline: true
})

storiesOf('Welcome', module)
  .add('Introduction', () => <Welcome />)

storiesOf('Buttons', module)
  .add('Button', () => <Button>Button</Button>)
  .add('Button rounded', () => <Button rounded>Button</Button>)
  .add('Button full width', () => <Button fullwidth>Button</Button>)
  .add('PrimaryButton', () => <PrimaryButton>Button</PrimaryButton>)
  .add('PrimaryButton rounded', () => <PrimaryButton rounded>Button</PrimaryButton>)
  .add('PrimaryButton full width', () => <PrimaryButton fullwidth>Button</PrimaryButton>)
  .add('SecondaryButton', () => <SecondaryButton>Button</SecondaryButton>)
  .add('SecondaryButton rounded', () => <SecondaryButton rounded>Button</SecondaryButton>)
  .add('SecondaryButton full width', () => <SecondaryButton fullwidth>Button</SecondaryButton>)
  .add('ButtonGroup', () => <ButtonGroup>
                              <PrimaryButton>Primary Button</PrimaryButton>
                              <SecondaryButton>Secondary Button</SecondaryButton>
                            </ButtonGroup>)

storiesOf('Dropdowns', module)
  .add('SimpleDropdown', () => <SimpleDropdown
                                  id={"1"}
                                  dropDownOpen = {false}
                                  handleToggle={function(){}}
                                  items={[{text: "item 1", value: 1},
                                          {text: "item 2", value: 2}]}
                                  callback={function(){}}/>)


storiesOf('Gauges', module)
  .add('ConfirmationGauge empty', () => <ConfirmationGauge/>)
  .add('ConfirmationGauge yellow', () => <ConfirmationGauge nbConfirmations={1}/>)
  .add('ConfirmationGauge orange', () => <ConfirmationGauge nbConfirmations={2}/>)
  .add('ConfirmationGauge green', () => <ConfirmationGauge nbConfirmations={3}/>)

//TODO: Fin out how to name icons
storiesOf('Icon', module)
  .add('Icon', () => <Icon name={"fa fa-picture-o"}/>)

storiesOf('Links', module)
  .add('Link', () => <Link>This is a link</Link>)

//What is total? Why doesn't it show a modal?
storiesOf('Modals', module)
  .add('Modal', () => <Modal position={1} total={1} title="Modal"/>)

storiesOf('Separators', module)
  .add('Separator', () => <div><br /><Separator /><br /></div>)

storiesOf('Tooltip', module)
  .add('Tooltip', () => <Tooltip>This is a tooltip.</Tooltip>)

storiesOf('Text', module)
  .add('Text', () => <Text>This is text</Text>)
  .add('Red Text', () => <Text color="red">This is text</Text>)
  .add('High weight text', () => <Text weight={900}>This is fat text</Text>)
  .add('Capitalized Text', () => <Text capitalize>This is capitalized text</Text>)
  .add('Italic Text', () => <Text italic>This is italic text</Text>)
  .add('Uppercase Text', () => <Text uppercase>This is uppercase text</Text>)
  .add('Alt font Text', () => <Text altFont>This is text using an alternative font</Text>)

  storiesOf('TextGroup', module)
    .add('TextGroup not aligned', () => <TextGroup><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text></TextGroup>)
    .add('TextGroup aligned', () => <TextGroup aligned><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text><Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text></TextGroup>)
