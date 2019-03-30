import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Typography, LinearProgress, TextField } from '@material-ui/core'
import { cached } from 'use-cached'


const DAYS_SHORT_CACHE_KEY = 'mff_tower_day'

const dailyGoal = ({ daysShort = null, monthQuota = 20000 } = {}) => (today) => {
  const maxDays = daysShort ? today.daysInMonth() - daysShort : today.daysInMonth()
  const goal = Math.ceil(today.date() / maxDays * monthQuota)
  return goal >= monthQuota ? monthQuota : goal
}

const endsIn = (now) => moment.duration(moment(now).endOf('day').diff(now)).humanize(true)

const normalizeBy = ({ min = 0, max = 20000 } = {}) => value => (value - min) * 100 / (max - min)
const normalize = normalizeBy()

const towerStart = (daysShort, now) => moment(now).subtract(daysShort, 'days').startOf('day')
const towerDaysShort = (start, now) => moment.duration(moment(now).endOf('day').diff(start)).days()

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    marginBottom: '1em',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 108,
  },
})

const useTimer = () => {
  const [timer, updateTimer] = useState(moment().utcOffset(-480))
  useEffect(() => {
    const interval = setInterval(() => {
      updateTimer(moment().utcOffset(-480))
    }, 1000)
    return () => {
      clearInterval(interval)
    }
  })
  return timer
}

const useTowerDaysShort = (initial) => cached(DAYS_SHORT_CACHE_KEY)(useState)(initial)

/*
TODOs:
- Add server picker (to apply diff time zone offset)
- Add input for currently farmed amount (to show how much's needed for today)
- Add input for tower daysShort
*/
const MagiciteGoal = ({ classes }) => {
  const timer = useTimer()
  const [daysShort, setDaysShort] = useTowerDaysShort(10)
  const casualGoal = dailyGoal()
  const towerGoal = dailyGoal({ daysShort })
  const onDaysShortChange = ({ target: { value } }) => {
    const startDate = moment(`${value} -0800`, 'YYYY-MM-DD ZZ')
    const days = towerDaysShort(startDate, timer)
    setDaysShort(days)
  }
  return (
    <Fragment>
      <Typography gutterBottom={true} component='h3' variant='h5'>
        Server time: {timer.format('LLL')}
      </Typography>
      <Paper className={classes.paper}>
        <Typography gutterBottom={true} component='h3' variant='h5'>Casual</Typography>
        <Typography gutterBottom={true} component='p'>
          you should have <strong>{casualGoal(timer)}</strong> magicites or more by end of today (<strong>{endsIn(timer)}</strong>)
        </Typography>
        <LinearProgress variant="determinate" value={normalize(casualGoal(timer))} />
      </Paper>
      <Paper className={classes.paper}>
        <Typography gutterBottom={true} component='h3' variant='h5'>Before Tower</Typography>
        <TextField
          type='date'
          label={'Tower Start'}
          margin='dense'
          value={towerStart(daysShort, timer).format('YYYY-MM-DD')}
          onChange={onDaysShortChange}
        />
        <Typography gutterBottom={true} component='p'>
          you should have <strong>{towerGoal(timer)}</strong> magicites or more by end of today (<strong>{endsIn(timer)}</strong>)
        </Typography>
        <LinearProgress variant="determinate" value={normalize(towerGoal(timer))} />
      </Paper>
    </Fragment>
  )
}

MagiciteGoal.propTypes = { classes: PropTypes.object.isRequired }

export default withStyles(styles)(MagiciteGoal)
