import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Typography, LinearProgress } from '@material-ui/core'


const dailyGoal = ({ daysShort = null, monthQuota = 20000 } = {}) => (today) => {
  const maxDays = daysShort ? today.daysInMonth() - daysShort : today.daysInMonth()
  return Math.ceil(today.date() / maxDays * monthQuota)
}

const endsIn = (now) => moment.duration(moment(now).endOf('day').diff(now)).humanize(true)

const normalizeBy = ({ min = 0, max = 20000 } = {}) => value => (value - min) * 100 / (max - min)
const normalize = normalizeBy()

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: '1em',
  },
})

/*
TODOs:
- Add server picker (to apply diff time zone offset)
- Add input for currently farmed amount (to show how much's needed for today)
- Add input for tower daysShort
*/
const MagiciteGoal = ({ classes }) => {
  const [timer, updateTimer] = useState(moment().utcOffset(-480))
  useEffect(() => {
    const interval = setInterval(() => {
      updateTimer(moment().utcOffset(-480))
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  })

  const casualGoal = dailyGoal()
  const towerGoal = dailyGoal({ daysShort: 10 })
  const goals = [
    { title: 'Casual', goal: casualGoal(timer) },
    { title: 'Before Tower', goal: towerGoal(timer) },
  ]
  return (
    <Fragment>
      <Typography gutterBottom={true} component='h3' variant='h5'>
        Server time: {timer.format('LLL')}
      </Typography>
      {goals.map((g) => (
        <Paper className={classes.paper} key={g.title}>
          <Typography gutterBottom={true} component='h3' variant='h5'>{g.title}</Typography>
          <Typography gutterBottom={true} component='p'>
            you should have <strong>{g.goal}</strong> magicites or more by end of today (<strong>{endsIn(timer)}</strong>)
          </Typography>
          <LinearProgress variant="determinate" value={normalize(g.goal)} />
        </Paper>
      ))}
    </Fragment>
  )
}

MagiciteGoal.propTypes = { classes: PropTypes.object.isRequired }

export default withStyles(styles)(MagiciteGoal)
