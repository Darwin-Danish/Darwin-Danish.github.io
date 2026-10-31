'use client'

import React, { useState, useEffect } from 'react'
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { getLanguageIcon } from '@/components/bento/LanguageIcons'

interface Language {
  name: string
  hours: number
  percent: number
  fill: string
}

interface Props {
  omitLanguages?: string[]
}

const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--chart-7))',
] as const

const PRIMARY_WAKATIME_API_URL =
  'https://wakatime.com/share/@d0f744b2-fafc-4652-8a16-4bdc7e18ab67/dbcbcb0f-bdcb-4efa-9e44-560db58a9044.json'
const MAX_LANGUAGES = 7
const ICON_SIZE = 20
const CIRCLE_RADIUS = 16

const chartConfig: ChartConfig = {
  percent: {
    label: 'Percentage',
    color: 'var(--primary)',
  },
  label: {
    color: 'var(--muted-foreground)',
  },
  ...CHART_COLORS.reduce(
    (acc, color, index) => ({
      ...acc,
      [`language${index}`]: { label: `Language ${index + 1}`, color },
    }),
    {},
  ),
}

const CustomYAxisTick = ({ x, y, payload }: any) => {
  const icon = getLanguageIcon(payload.value.toLowerCase())
  const centerX = x - 15
  const centerY = y

  return (
    <g transform={`translate(${centerX},${centerY})`}>
      <title>{payload.value}</title>
      <rect
        x={-CIRCLE_RADIUS}
        y={-CIRCLE_RADIUS}
        width={CIRCLE_RADIUS * 2}
        height={CIRCLE_RADIUS * 2}
        fill="var(--border)"
        fillOpacity="0.5"
      />
      <foreignObject
        width={ICON_SIZE}
        height={ICON_SIZE}
        x={-ICON_SIZE / 2}
        y={-ICON_SIZE / 2}
      >
        <div className="flex h-full w-full items-center justify-center p-0.5">
          {icon ? (
            React.cloneElement(
              icon as React.ReactElement,
              {
                size: ICON_SIZE - 2,
                className: 'text-foreground',
              } as any,
            )
          ) : (
            <span className="text-foreground text-sm font-medium">
              {payload.value.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </foreignObject>
    </g>
  )
}

const LoadingSkeleton = () => (
  <div className="size-full rounded-3xl p-6">
    <div className="space-y-1.5">
      {Array.from({ length: MAX_LANGUAGES }).map((_, index) => (
        <div key={index} className="flex items-center gap-x-2">
          <Skeleton className="size-8" />
          <div className="flex-1">
            <Skeleton
              className="h-8"
              style={{ width: `${100 * Math.pow(0.75, index)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
)

const DEFAULT_FALLBACK_LANGUAGES = [
  { name: 'Dart', hours: 42.5, percent: 26 },
  { name: 'Python', hours: 38.0, percent: 23 },
  { name: 'TypeScript', hours: 29.5, percent: 18 },
  { name: 'C++', hours: 22.0, percent: 14 },
  { name: 'Astro', hours: 18.0, percent: 11 },
  { name: 'C', hours: 12.0, percent: 8 },
]

const useWakatimeData = (omitLanguages: string[]) => {
  const [languages, setLanguages] = useState<Language[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = 'dd_wakatime_cache'
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 6000)
        const response = await fetch(PRIMARY_WAKATIME_API_URL, {
          signal: controller.signal,
        })
        clearTimeout(timeoutId)
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`)
        }
        const data = await response.json()
        const rawLanguages = Array.isArray(data?.data) ? data.data : []

        if (rawLanguages.length > 0 && typeof window !== 'undefined') {
          try {
            localStorage.setItem(cacheKey, JSON.stringify(rawLanguages))
          } catch {}
        }

        const filteredData = rawLanguages
          .filter(
            (lang: { name: string }) => !omitLanguages.includes(lang.name),
          )
          .slice(0, MAX_LANGUAGES)

        const totalHours = filteredData.reduce(
          (acc: number, lang: any) => acc + (lang.hours || 0),
          0,
        )

        const processedLanguages = filteredData.map(
          (
            lang: { name: string; hours?: number; percent?: number },
            index: number,
          ) => {
            let percent = 0
            if (lang.percent !== undefined) {
              percent = lang.percent
            } else if (totalHours > 0 && lang.hours !== undefined) {
              percent = Number(((lang.hours / totalHours) * 100).toFixed(1))
            }

            return {
              name: lang.name,
              hours: lang.hours ? Number(lang.hours.toFixed(2)) : 0,
              percent,
              fill: CHART_COLORS[index % CHART_COLORS.length],
            }
          },
        )

        setLanguages(processedLanguages)
      } catch (err) {
        console.warn('Wakatime fetch failed, using cached/default data:', err)
        let sourceLanguages = DEFAULT_FALLBACK_LANGUAGES
        if (typeof window !== 'undefined') {
          try {
            const cached = localStorage.getItem(cacheKey)
            if (cached) sourceLanguages = JSON.parse(cached)
          } catch {}
        }
        const filtered = sourceLanguages
          .filter((l) => !omitLanguages.includes(l.name))
          .slice(0, MAX_LANGUAGES)
        const fallback = filtered.map((lang, index) => ({
          name: lang.name,
          hours: lang.hours ? Number(lang.hours.toFixed(2)) : 0,
          percent: lang.percent || 0,
          fill: CHART_COLORS[index % CHART_COLORS.length],
        }))
        setLanguages(fallback)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [omitLanguages.join(',')])

  return { languages, isLoading }
}

const WakatimeGraph = ({ omitLanguages = [] }: Props) => {
  const { languages, isLoading } = useWakatimeData(omitLanguages)

  if (isLoading) return <LoadingSkeleton />
  if (languages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-3xl p-4">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            No activity recorded yet
          </p>
        </div>
      </div>
    )
  }

  return (
    <ChartContainer config={chartConfig} className="size-full p-4">
      <BarChart
        accessibilityLayer
        data={languages}
        layout="vertical"
        margin={{
          left: 0,
          right: 36,
          top: 4,
          bottom: 4,
        }}
        width={undefined}
        height={undefined}
      >
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          width={45}
          tick={<CustomYAxisTick />}
        />
        <XAxis type="number" hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey="percent" radius={[0, 0, 0, 0]} isAnimationActive={false}>
          <LabelList
            dataKey="percent"
            position="right"
            formatter={(value: number) => `${Math.round(value)}%`}
            className="fill-foreground/80 font-medium"
            fontSize={13}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

export default WakatimeGraph
