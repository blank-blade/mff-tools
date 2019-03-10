import React from 'react'

import DataTable from 'mui-datatables'

import { jobs } from './data'


const columns = Object.keys(jobs[0])

const JobTable = () => (
  <DataTable
    title='Jobs'
    data={jobs.map(job => columns.map(col => job[col]))}
    columns={Object.keys(jobs[0])}
  />
)

export default JobTable
