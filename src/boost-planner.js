import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'

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
  Avatar,
  Divider,
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
  'MP 5 ⭐ - 60': {
    base: 3 * 60,
    vip: 4 * 60,
    checked: true,
  },
  'MP 4 ⭐ - 50': {
    base: 3 * 50,
    vip: 4 * 50,
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
  timerForm: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 108,
  },
  nodeList: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  avatar: {
    margin: 0,
    color: '#fff',
    backgroundColor: '#3f51b5', // TODO: use theme color
  },
})

const BoostPlanner = ({ classes }) => {
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
    <Grid
      className={classes.root}
      container
      spacing={8}
    >
      <Grid item>
        <FormControl
          component='fieldset'
          className={classes.timerForm}
          noValidate
          autoComplete='off'
          fullWidth
        >
          <FormLabel component='legend'>Boost/Mod Timer Left</FormLabel>
          <FormGroup row>
            {['days', 'hours', 'minutes'].map(type => (
              <TextField
                className={classes.textField}
                key={type}
                // variant='outlined'
                type='number'
                min={0}
                label={type}
                margin='dense'
                value={time[type] || ''}
                onChange={onTimeChange(type)}
              />
            ))}
            <FormControlLabel
              control={
                <Switch
                  checked={vip}
                  onChange={onVIPChange}
                  color='primary'
                />
              }
              label='VIP Mode'
            />
          </FormGroup>
        </FormControl>
        <List className={classes.nodeList}>
          {Object.entries(nodes).map(([node, { checked }]) => (
            <ListItem key={node} role={undefined} onClick={onNodeCheck(node)} button dense>
              <Checkbox
                checked={checked}
                disableRipple
                color={suggestions[node] > 0 ? 'primary' : 'default'}
              />
              <ListItemText primary={checked ? (suggestions[node] > 0 ? <strong>{node}</strong> : node) : <del>{node}</del>} />
              {suggestions[node] > 0 && (
                <Avatar className={classes.avatar}>
                  {suggestions[node]}
                </Avatar>
              )}
            </ListItem>
          ))}
          {suggestions.chill > 0 && (
            <Fragment>
              <Divider />
              <ListItem button dense>
                <Checkbox
                  checked={true}
                  disabled
                />
                <ListItemText
                  primary='Chill for'
                  secondary={`${suggestions.chill} ${suggestions.chill > 1 ? 'minutes' : 'minute'}`}
                />
              </ListItem>
            </Fragment>
          )}
        </List>
      </Grid>
      <Grid item>
      </Grid>
    </Grid>
  )
}

BoostPlanner.propTypes = { classes: PropTypes.object.isRequired }

export default withStyles(styles)(BoostPlanner)
