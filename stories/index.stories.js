import React from 'react'

import { storiesOf } from '@storybook/react'

import { JobTable, MagiciteGoal } from '../src'


storiesOf('MFF Tools', module)
  .add('Magicite Goal', () => (
    <MagiciteGoal />
  ))
  .add('Job Table', () => (
    <JobTable />
  ))
