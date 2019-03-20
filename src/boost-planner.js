import React, { useState } from 'react'

import {
  Grid,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Switch,
  Checkbox,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const getDefaultNodes = () => ({
  'Bahamut Lagoon - 100': {
    base: 4.5 * 100,
    vip: 6 * 100,
    checked: true,
  },
  'Bahamut Lagoon - 60': {
    base: 4.5 * 60,
    vip: 6 * 60,
    checked: true,
  },
  'Bahamut Lagoon - 40': {
    base: 4.5 * 40,
    vip: 6 * 40,
    checked: true,
  },
  'Labyrinthine Tower - 8': {
    base: 3 * 8,
    vip: 4 * 8,
    checked: true,
  },
  'Brink 3 - 3': {
    base: 3 * 3,
    vip: 4 * 3,
    checked: true,
  },
})

const revNodes = (type) => (nodes) => {
  const map = {}
  Object.entries(nodes).forEach(([key, value]) => {
    map[value[type]] = key
  })
  return map
}

const nodeValues = (type) => (nodes) => Object.values(nodes).map(value => value[type])

const normTime = ({ days, hours, minutes }) => ((days || 0) * 24 * 60) + ((hours || 0) * 60) + (minutes || 0) * 1

const filterNodes = (nodes) => {
  const filtered = {}
  Object.entries(nodes).forEach(([node, data]) => {
    if (data.checked) {
      filtered[node] = { ...data }
    }
  })
  return filtered
}

const getSuggestions = ({ type, time, nodes }) => {
  const suggestions = {}
  const filtered = filterNodes(nodes)
  const values = nodeValues(type)(filtered)
  const rev = revNodes(type)(filtered)
  let minutes = normTime(time)
  // TODO: this does some undesired mutations, need to investigate
  values.forEach(val => {
    const runs = Math.floor(minutes / val)
    if (runs) {
      suggestions[rev[val]] = runs
    }
    minutes = minutes % val
  })

  if (minutes) {
    suggestions.chill = minutes
  }

  return suggestions
}

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  nodeList: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
})

/*
TODOs:
*/
const BoostPlanner = (classes) => {
  const [time, setTime] = useState({ days: null, hours: null, minutes: null })
  const onTimeChange = (type) => ({ target: { value } }) => {
    setTime(time => ({ ...time, [type]: value }))
  }

  const [vip, setVIP] = useState(false)
  const onVIPChange = ({ target: { checked } }) => {
    setVIP(checked)
  }

  const [nodes, setNodes] = useState(getDefaultNodes())
  const onNodeCheck = (node) => () => {
    setNodes({
      ...nodes,
      //
      [node]: {
        ...nodes[node],
        checked: !nodes[node].checked,
      },
    })
  }

  const suggestions = getSuggestions({ type: vip ? 'vip' : 'base', time, nodes })

  return (
    <Grid container className={classes.root} spacing={8}>
      <Grid item xs={12} sm={2}>
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
      <Grid item xs={12} sm={10}>
        <List className={classes.nodeList}>
          {Object.entries(nodes).map(([node, { checked }]) => (
            <ListItem key={node} role={undefined} onClick={onNodeCheck(node)} button dense>
              <Checkbox
                checked={checked}
                disableRipple
                color='primary'
              />
              <ListItemText primary={suggestions[node] > 0 ? node : <del>{node}</del>} />
              {suggestions[node] > 0 && (
                <ListItemSecondaryAction>
                  {suggestions[node]} times
                </ListItemSecondaryAction>
              )}
            </ListItem>
          ))}
          {/* <Divider /> */}
          <ListItem button dense>
            <Checkbox
              checked={true}
              readOnly
              color='primary'
            />
            <ListItemText primary='Chill' />
            <ListItemSecondaryAction>
              {suggestions.chill > 0 && (
                `${suggestions.chill} ${suggestions.chill > 1 ? 'minutes' : 'minute'}`
              )}
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Grid>
    </Grid>
  )
}

export default withStyles(styles)(BoostPlanner)
