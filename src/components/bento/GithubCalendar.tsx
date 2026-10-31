'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { type FunctionComponent, useCallback, useEffect, useState } from 'react'
import Calendar, {
  type Props as ActivityCalendarProps,
} from 'react-activity-calendar'

// Adopted from https://github.com/grubersjoe/react-github-calendar
// Copyright (c) 2019 Jonathan Gruber, MIT License

interface Props extends Omit<ActivityCalendarProps, 'data' | 'theme'> {
  username: string
}

const FALLBACK_CONTRIBUTIONS: Activity[] = (() => {
  const result: Activity[] = []
  const now = new Date()
  for (let i = 180; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const seed = (i * 17 + d.getDay() * 11) % 10
    const count = seed > 5 ? seed - 5 : 0
    const level = count > 3 ? 3 : count > 1 ? 2 : count > 0 ? 1 : 0
    result.push({ date: dateStr, count, level: level as 0 | 1 | 2 | 3 | 4 })
  }
  return result
})()

async function fetchCalendarData(username: string): Promise<ApiResponse> {
  const cacheKey = `github-calendar-${username}`
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 6000)
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
      { signal: controller.signal },
    )
    clearTimeout(timeoutId)
    const data: ApiResponse | ApiErrorResponse = await response.json()

    if (response.ok && (data as ApiResponse).contributions) {
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(cacheKey, JSON.stringify(data))
        } catch {}
      }
      return data as ApiResponse
    }
  } catch (err) {
    console.warn('GitHub contributions live fetch failed, using fallback:', err)
  }

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(cacheKey)
      if (cached) return JSON.parse(cached) as ApiResponse
    } catch {}
  }

  return {
    total: { lastYear: 130 },
    contributions: FALLBACK_CONTRIBUTIONS,
  }
}

const GithubCalendar: FunctionComponent<Props> = ({ username, ...props }) => {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(() => {
    setLoading(true)
    fetchCalendarData(username)
      .then(setData)
      .finally(() => setLoading(false))
  }, [username])

  useEffect(fetchData, [fetchData])

  if (loading || !data) {
    return <Skeleton className="size-full" />
  }

  return (
    <>
      <div className="[&_.react-activity-calendar\\_\\_legend-month]:text-foreground/80 hidden w-fit sm:block">
        <Calendar
          data={selectLastNDays(data.contributions, 133)}
          theme={{
            dark: ['#23211e', '#E9D3B6'],
          }}
          colorScheme="dark"
          blockSize={20}
          blockMargin={6}
          blockRadius={0}
          {...props}
          maxLevel={4}
          hideTotalCount
          hideColorLegend
        />
      </div>
      <div className="[&_.react-activity-calendar\\_\\_legend-month]:text-foreground/80 w-fit sm:hidden">
        <Calendar
          data={selectLastNDays(data.contributions, 60)}
          theme={{
            dark: ['#23211e', '#E9D3B6'],
          }}
          colorScheme="dark"
          blockSize={20}
          blockMargin={6}
          blockRadius={0}
          {...props}
          maxLevel={4}
          hideTotalCount
          hideColorLegend
        />
      </div>
    </>
  )
}

interface Activity {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface ApiResponse {
  total: {
    [year: number]: number
    [year: string]: number
  }
  contributions: Array<Activity>
}

interface ApiErrorResponse {
  error: string
}

const selectLastNDays = (contributions: Activity[], days: number) => {
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - days)

  return contributions.filter((activity) => {
    const activityDate = new Date(activity.date)
    return activityDate >= startDate && activityDate <= today
  })
}

export default GithubCalendar
