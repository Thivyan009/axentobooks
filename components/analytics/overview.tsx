"use client"

import { useMemo } from "react"
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, Tooltip } from "recharts"
import type { ChartType } from "@/lib/types"

interface OverviewProps {
  data: number[]
  chartType: ChartType
  isLoading?: boolean
}

export function Overview({ data, chartType, isLoading }: OverviewProps) {
  const chartData = useMemo(() => {
    return data.map((value, index) => ({
      name: `Week ${index + 1}`,
      value,
    }))
  }, [data])

  if (isLoading) {
    return <div className="mt-4 h-[80px] animate-pulse bg-muted rounded-md" />
  }

  return (
    <div className="mt-4 h-[80px]">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === "line" ? (
          <LineChart data={chartData}>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {payload[0].payload.name}
                          </span>
                          <span className="font-bold">${payload[0].value}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="currentColor"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        ) : (
          <BarChart data={chartData}>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {payload[0].payload.name}
                          </span>
                          <span className="font-bold">${payload[0].value}</span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="value" fill="currentColor" radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

