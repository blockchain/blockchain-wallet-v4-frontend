
# Components guildelines

## Introduction

This `data` folder contains everything necessary to manage the redux-state and required side effects.

## Modules

A module can contain the following files:
1. actionTypes.js
2. actions.js
3. reducers.js
4. sagas.js
5. selectors.js
6. services.js

## Structure

### Root

The `root` of this folder contains all the modules shared accross the wallet

* alerts
* cache
* form
* goals
* logs
* modals
* preferences
* router
* scroll
* session
* wizard

### Components

The `components` folder is special and contains feature related modules.

* activityList
* bchTransactions
* exchange
* etc...

Each component created in the wallet should have any user-related actions (click on a button, change in an input, etc...) mapped to an unique action, then all the logic / flow of actions can be encapsulated in a saga listening to this specific action.

1. actions / actionTypes
  * naming convention: `COMPONENT_ELEMENT_WHATHAPPENED`
    * For example, clicking on the time filter on the price chart component will translate to : `PRICECHART_TIME_CLICKED`

2. reducers
  * optional
  * required when an action 

3. sagas
  * optional
  * required when an action has to compute some data, or when a flow of actions has to be executed

4. selectors
  * optional (only needed when we have the component has its own reducer)
  * no transformation at this stage
  * scoped to what the reducer is handling and no more
