"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Application } from "../../types"

type Props = {
  applications: Application[]
}

function getChartData(applications: Application[]) {
  const last8Weeks: { week: string; Applied: number; Interview: number; Offer: number; Rejected: number }[] = []

  for (let i = 7; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i * 7)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)

    const weekApps = applications.filter((a) => {
      const appDate = new Date(a.appliedAt)
      return appDate >= weekStart && appDate <= weekEnd
    })

    last8Weeks.push({
      week: weekStart.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      Applied: weekApps.filter((a) => a.status === "APPLIED").length,
      Interview: weekApps.filter((a) => a.status === "INTERVIEW").length,
      Offer: weekApps.filter((a) => a.status === "OFFER").length,
      Rejected: weekApps.filter((a) => a.status === "REJECTED").length,
    })
  }

  return last8Weeks
}

export default function ApplicationsChart({ applications }: Props) {
  const data = getChartData(applications)

  return (
    <div className="rounded-lg border bg-white p-6 mb-8">
      <h2 className="text-sm font-medium text-gray-700 mb-4">
        Applications over time
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barSize={12}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "12px",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }}
          />
          <Bar dataKey="Applied" fill="#93c5fd" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Interview" fill="#fcd34d" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Offer" fill="#86efac" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Rejected" fill="#fca5a5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}