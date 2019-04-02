import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Typography, LinearProgress, TextField, InputAdornment, IconButton } from '@material-ui/core'
import { SettingsBackupRestore } from '@material-ui/icons'
import cached from 'use-cached'


const DAYS_SHORT_CACHE_KEY = 'mff_tower_day'
const FARMED_MAGS_CACHE_KEY = 'mff_farmed_mags'

const dailyGoal = ({ daysShort = null, monthQuota = 20000 } = {}) => (today) => {
  const maxDays = daysShort ? today.daysInMonth() - daysShort : today.daysInMonth()
  const goal = Math.ceil(today.date() / maxDays * monthQuota)
  return goal >= monthQuota ? monthQuota : goal
}

const endsIn = (now) => moment.duration(moment(now).endOf('day').diff(now)).humanize(true)

const normalizeBy = ({ min = 0, max = 20000 } = {}) => value => (value - min) * 100 / (max - min)
const normalize = normalizeBy()

const towerStart = (daysShort, now) => moment(now).endOf('month').subtract(daysShort, 'days').startOf('day')
const towerDaysShort = (start, now) => moment.duration(moment(now).endOf('month').diff(start)).days()

const styles = theme => ({
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 1.3,
    paddingBottom: theme.spacing.unit * 1.3,
    marginBottom: theme.spacing.unit * 1.3,
    marginTop: theme.spacing.unit * 1.3,
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

const useTowerDaysShort = (...args) => cached(DAYS_SHORT_CACHE_KEY)(useState)(...args)

const useFarmedMags = (...args) => cached(FARMED_MAGS_CACHE_KEY)(useState)(...args)

const MagiciteGoal = ({ classes }) => {
  const casualGoal = dailyGoal()
  const timer = useTimer()
  const [mags, setMags] = useFarmedMags(casualGoal(timer))

  const [daysShort, setDaysShort] = useTowerDaysShort(10)
  const towerGoal = dailyGoal({ daysShort })

  const onDaysShortChange = ({ target: { value } }) => {
    const startDate = moment(`${value} -0800`, 'YYYY-MM-DD ZZ')
    const days = towerDaysShort(startDate, timer)
    setDaysShort(days)
  }
  const onMagsChange = ({ target: { value } }) => {
    setMags(value)
  }

  return (
    <>
      <TextField
        variant='outlined'
        type='number'
        label={'Farmed Magicites'}
        margin='dense'
        value={mags}
        onChange={onMagsChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                aria-label='Resest farmed magicites'
                onClick={() => { setMags(0) }}
              >
                <SettingsBackupRestore />
              </IconButton>
              {[10, 100, 1000, 10000].map(v => (
                <IconButton
                  key={v}
                  aria-label={`Add ${v} to farmed magicites`}
                  onClick={() => { setMags((prev) => parseInt(prev) + v) }}
                >
                  +{v}
                </IconButton>
              ))}
            </InputAdornment>
          ),
        }}
      />
      <Paper className={classes.paper}>
        <Typography gutterBottom={true} component='h3' variant='h5'>Casual</Typography>
        {mags < casualGoal(timer) ? (
          <Typography gutterBottom={true} component='p'>
            You should <strong>farm {casualGoal(timer) - mags} and have {casualGoal(timer)}</strong> magicites or more by end of today (<strong>{endsIn(timer)}</strong>)
          </Typography>
        ) : (
          <Typography gutterBottom={true} component='p'>
            <strong>Done for today</strong>
          </Typography>
        )}
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
        {mags < towerGoal(timer) ? (
          <Typography gutterBottom={true} component='p'>
            You should <strong>farm {towerGoal(timer) - mags} and have {towerGoal(timer)}</strong> magicites or more by end of today (<strong>{endsIn(timer)}</strong>)
          </Typography>
        ) : (
          <Typography gutterBottom={true} component='p'>
            <strong>Done for today</strong>
          </Typography>
        )}
        <LinearProgress variant="determinate" value={normalize(towerGoal(timer))} />
      </Paper>
      <Typography gutterBottom={true} component='p'>Server time: {timer.format('LLLL')}</Typography>
    </>
  )
}

MagiciteGoal.propTypes = { classes: PropTypes.object.isRequired }

export default withStyles(styles)(MagiciteGoal)
