import React, { useState } from 'react'

import {
  Grid,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Switch,
  TextField,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'

const getNodes = () => ({
  'Bahamut Lagoon - 100': {
    base: 4.5 * 100,
    vip: 6 * 100,
  },
  'Bahamut Lagoon - 60': {
    base: 4.5 * 60,
    vip: 6 * 60,
  },
  'Bahamut Lagoon - 40': {
    base: 4.5 * 40,
    vip: 6 * 40,
  },
  'Labyrinthine Tower - 8': {
    base: 3 * 8,
    vip: 4 * 8,
  },
  'Brink 3 - 3': {
    base: 3 * 3,
    vip: 4 * 3,
  },
})

const revNodes = (type) => {
  const map = {}
  Object.entries(getNodes()).forEach(([key, value]) => {
    map[value[type]] = key
  })
  return map
}

const nodeValues = (type) => Object.values(getNodes()).map(value => value[type])

const normTime = ({ days, hours, minutes }) => ((days || 0) * 24 * 60) + ((hours || 0) * 60) + (minutes || 0) * 1

const getList = ({ type, time }) => {
  const list = []
  const values = nodeValues(type)
  const rev = revNodes(type)
  let minutes = normTime(time)
  // TODO: this does some undesired mutations, need to investigate
  values.forEach(val => {
    const runs = Math.floor(minutes / val)
    if (runs) {
      list.push(`Run ${rev[val]} node: ${runs} times`)
    }
    minutes = minutes % val
  })

  if (minutes) {
    list.push(`Chill for ${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`)
  }

  return list
}

/*
TODOs:
*/
const BoostPlanner = () => {
  const [time, setTime] = useState({ days: null, hours: null, minutes: null })
  const onTimeChange = (type) => ({ target: { value } }) => {
    setTime(time => ({ ...time, [type]: value }))
  }

  const [vip, setVIP] = useState(false)
  const onVIPChange = ({ target: { checked } }) => {
    setVIP(checked)
  }

  const list = getList({ type: vip ? 'vip' : 'base', time })

  return (
    <Grid container spacing={24}>
      <Grid item xs>
        <FormControl component='fieldset'>
          <FormLabel component='legend'>Boost/Mod Timer Left</FormLabel>
          <FormControlLabel
            control={
              <Switch
                checked={vip}
                onChange={onVIPChange}
                value='vip'
                color='primary'
              />
            }
            label='VIP Mode'
          />
          <FormGroup>
            {['days', 'hours', 'minutes'].map(type => (
              <TextField
                key={type}
                variant='outlined'
                type='number'
                min={0}
                label={type}
                margin='dense'
                value={time[type] || ''}
                onChange={onTimeChange(type)}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Grid>
      <Grid item xs>
        <List>
          {list.map(suggestion => (
            <ListItem key={suggestion} role={undefined} dense>
              <ListItemText primary={suggestion} />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  )
}

export default BoostPlanner
