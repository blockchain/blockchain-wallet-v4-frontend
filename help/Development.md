# Dream Wallet Front-End - Development guidelines

## IMPORTANT
- Styling _should_ be abstracted from components at all but the most basic level (ui elements like Button, Text, etc)
- Layout components will be imported from _reactstrap_, which uses bootstrap 4 internally
- Components with highly-customized styles (Wallet layout, most angular 1.5 components, etc) will use styled-components
- General components will use _existing css_ where possible in the interest of speed, staying lean, and maintaining design backward-compatibility (Button, bootstrap Modal, etc)


## Structure

* `src`
  * [assets](#assets)
  * [components](#components)
  * [data](#data)
  * [middleware](#middleware)
  * [scenes](#scenes)
  * [services](#services)
  * [store](#store)
  * [tools](#tools)

## Assets

The **assets** directory contains locale resources like images, fonts, locales and sass

* `fonts`
* `img`
* `locales`
* `sass`

## Components

The **components** directory contains shared/reusable components accross the project.

Any components in the **Shared** sub directory will be part of a standalone npm package to use them in other **React** projects

* `Layouts`
* `Providers`
* `Shared`

### Layouts

The **Layouts** directory contains different layouts used accross the project.

* `Public`
  * used by *Login*, *Register* pages
* `Landing`
  * used by *Landing* page
* `Wallet`
  * used by all *Wallet* pages

### Providers
* `ConnectedIntlProvider`
  * propagates localized messages through the application

### Shared

## Data

The **data** directory contains 

## Middleware

## Scenes

## Services

## Store

## Tools

