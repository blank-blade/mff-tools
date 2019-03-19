import React from 'react'

import { storiesOf } from '@storybook/react'

import { JobTable, MagiciteGoal, BoostPlanner } from '../src'


storiesOf('MFF Tools', module)
  .add('Magicite Goal', () => (
    <MagiciteGoal />
  ))
  .add('Boost Planner', () => (
    <BoostPlanner />
  ))
  .add('Job Table', () => (
    <JobTable />
  ))
