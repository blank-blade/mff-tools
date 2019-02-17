import React from 'react'
import PropTypes from 'prop-types'

import { withStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import DataTable from 'mui-datatables'

import { jobs } from '../data'


const columns = Object.keys(jobs[0])

const styles = () => ({
  root: {
    flexGrow: 1,
  },
})

const App = ({ classes }) => (
  <div className={classes.root}>
    <Grid container spacing={16}>
      <Grid item xs={12}>
        <DataTable
          title='Jobs'
          data={jobs.map(job => columns.map(col => job[col]))}
          columns={Object.keys(jobs[0])}
        />
      </Grid>
    </Grid>
  </div>
)

App.propTypes = { classes: PropTypes.object.isRequired }

export default withStyles(styles)(App)
