import React, { useState, useEffect } from 'react'

import { Tooltip, Avatar } from '@material-ui/core'
import DataTable from 'mui-datatables'
import lscache from 'lscache'


const API = 'https://woozyking-mff-ds.glitch.me/jobs'

const renderJSON = (value) => (<pre>{JSON.stringify(value, null, 2)}</pre>)

const renderAvatar = (value, image) => {
  if (image === '-') {
    return value
  }
  return (
    <Tooltip title={value} aria-label={value} placement='right'>
      <Avatar alt={value} src={image} />
    </Tooltip>
  )
}

const useJobs = () => {
  const [jobs, setJobs] = useState([])
  useEffect(() => {
    if (!jobs.length) {
      const cached = lscache.get(API)
      if (cached) {
        setJobs(cached)
      } else {
        fetch(API).then(r => r.json()).then(jobs => {
          lscache.set(API, jobs, 60)
          setJobs(jobs)
        }).catch(console.error) // TODO: add snackbar
      }
    }
  }, [jobs.length])
  return jobs
}

const JobTable = () => {
  const jobs = useJobs()

  return (
    <DataTable
      title='Jobs'
      data={jobs}
      columns={[
        {
          name: 'job-class-icon',
          label: 'Icon',
          options: {
            display: 'excluded',
          },
        },
        {
          name: 'job-thumbnail',
          label: 'Thumbnail',
          options: {
            display: 'excluded',
          },
        },
        {
          name: 'job-type',
          label: 'Type',
          options: {
            customBodyRender: (value, { rowData: [icon] }) => renderAvatar(value, icon),
          },
        },
        {
          name: 'job-name',
          label: 'Name',
          options: {
            customBodyRender: (value, { rowData: [_, thumbnail] }) => renderAvatar(value, thumbnail),
          },
        },
        {
          name: 'job-stats',
          label: 'Stats',
          options: {
            customBodyRender: renderJSON,
            display: false,
          },
        },
        {
          name: 'job-orbs',
          label: 'Orbs',
          options: {
            customBodyRender: renderJSON,
            display: false,
          },
        },
        {
          name: 'job-mp-role',
          label: 'MP Role',
        },
        {
          name: 'job-autoes',
          label: 'Autoes',
          options: {
            customBodyRender: renderJSON,
            display: false,
          },
        },
        {
          name: 'job-ultimate',
          label: 'Ultimate',
          options: {
            customBodyRender: renderJSON,
            display: false,
          },
        },
      ]}
    />
  )
}

export default JobTable
