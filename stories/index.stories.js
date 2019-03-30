import React from 'react'

import { storiesOf } from '@storybook/react'

import { JobTable, MagiciteGoal, BoostPlanner } from '../src'


storiesOf('MFF Tools', module)
  .add('Magicite Goal', () => (
    <MagiciteGoal />
  ), { options: { showPanel: false, panelPosition: 'right' } })
  .add('Boost Planner', () => (
    <BoostPlanner />
  ), { options: { showPanel: false, panelPosition: 'right' } })
  .add('Job Table', () => (
    <JobTable />
  ), { options: { showPanel: false, panelPosition: 'right' } })
