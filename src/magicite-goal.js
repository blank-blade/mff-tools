import React, { Fragment } from 'react'
import PropTypes from 'prop-types'

import moment from 'moment'
import { withStyles } from '@material-ui/core/styles'
import { Paper, Typography, LinearProgress } from '@material-ui/core'


const dailyGoal = ({ daysShort = null, monthQuota = 20000 } = {}) => {
  const today = moment().utcOffset(-480)
  const maxDays = daysShort ? today.daysInMonth() - daysShort : today.daysInMonth()
  return Math.ceil(today.date() / maxDays * monthQuota)
}

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

const MagiciteGoal = ({ classes }) => {
  const casualGoal = dailyGoal()
  const towerGoal = dailyGoal({ daysShort: 10 })
  return (
    <Fragment>
      <Paper className={classes.paper}>
        <Typography gutterBottom={true} component='h3' variant='h5'>Casual</Typography>
        <Typography gutterBottom={true} component='p'>you should have <strong>{ casualGoal }</strong> magicites or more by end of today</Typography>
        <LinearProgress variant="determinate" value={normalize(casualGoal)} />
      </Paper>
      <Paper className={classes.paper}>
        <Typography gutterBottom={true} component='h3' variant='h5'>Cap before tower</Typography>
        <Typography gutterBottom={true} component='p'>you should have <strong>{ towerGoal }</strong> magicites or more by end of today</Typography>
        <LinearProgress variant="determinate" value={normalize(towerGoal)} />
      </Paper>
    </Fragment>
  )
}

MagiciteGoal.propTypes = { classes: PropTypes.object.isRequired }

export default withStyles(styles)(MagiciteGoal)