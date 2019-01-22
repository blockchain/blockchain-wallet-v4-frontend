#!/bin/bash
echo 'Running install script'

npm install -g yarn@1.12.1 @babel/cli @babel/core@^7.0.0-0 rimraf cross-env
yarn
