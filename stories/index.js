import React from 'react'
import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
// import { linkTo } from '@storybook/addon-links'
import { withInfo, setDefaults } from '@storybook/addon-info'

import Welcome from './welcome.js'
import { Button, PrimaryButton, SecondaryButton, ButtonGroup, ConfirmationGauge,
          Icon, SimpleDropdown, Link, Modal, Separator, Tooltip,
          Text } from '../src'

// Set default settings for addon-info
setDefaults({
  inline: true
})

storiesOf('Welcome', module)
  .add('Introduction', () => <Welcome />)

storiesOf('Buttons', module)
  .addDecorator((story, context) => withInfo('Documentation')(story)(context))
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
  .addDecorator((story, context) => withInfo('Documentation')(story)(context))
  .add('SimpleDropdown', () => <SimpleDropdown
                                  id={"1"}
                                  dropDownOpen = {false}
                                  handleToggle={function(){}}
                                  items={[{text: "item 1", value: 1},
                                          {text: "item 2", value: 2}]}
                                  callback={function(){}}/>)


storiesOf('Gauges', module)
  .addDecorator((story, context) => withInfo('Documentation')(story)(context))
  .add('ConfirmationGauge empty', () => <ConfirmationGauge/>)
  .add('ConfirmationGauge yellow', () => <ConfirmationGauge nbConfirmations={1}/>)
  .add('ConfirmationGauge orange', () => <ConfirmationGauge nbConfirmations={2}/>)
  .add('ConfirmationGauge green', () => <ConfirmationGauge nbConfirmations={3}/>)

//TODO: Fin out how to name icons
storiesOf('Icon', module)
  .addDecorator((story, context) => withInfo('Documentation')(story)(context))
  .add('Icon', () => <Icon name={"fa fa-picture-o"}/>)

storiesOf('Links', module)
  .addDecorator((story, context) => withInfo('Documentation')(story)(context))
  .add('Link', () => <Link>This is a link</Link>)

//What is total? Why doesn't it show a modal?
storiesOf('Modals', module)
  .addDecorator((story, context) => withInfo('Documentation')(story)(context))
  .add('Modal', () => <Modal position={1} total={1} title="Modal"/>)

storiesOf('Separators', module)
  .addDecorator((story, context) => withInfo('Documentation')(story)(context))
  .add('Separator', () => <Separator><Button>Button in separator</Button></Separator>)

storiesOf('Tooltip', module)
  .addDecorator((story, context) => withInfo('Documentation')(story)(context))
  .add('Tooltip', () => <Tooltip>This is hehrnpiorejogp3rejk[pgkeq[elp</Tooltip>)

storiesOf('Text', module)
  .addDecorator((story, context) => withInfo('Documentation')(story)(context))
  .add('Text', () => <Text>This is text</Text>)
  .add('Red Text', () => <Text red>This is text</Text>)
  .add('Cyan Text', () => <Text cyan>This is text</Text>)
