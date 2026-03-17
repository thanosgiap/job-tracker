import { Application } from "../../types"

type Props = {
  applications: Application[]
}

function getThisWeekCount(applications: Application[]) {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return applications.filter(
    (a) => new Date(a.appliedAt) >= oneWeekAgo
  ).length
}

function getRate(applications: Application[], status: string) {
  if (applications.length === 0) return 0
  const count = applications.filter((a) => a.status === status).length
  return Math.round((count / applications.length) * 100)
}

export default function StatsCards({ applications }: Props) {
  const stats = [
    {
      label: "Total applications",
      value: applications.length,
      suffix: "",
    },
    {
      label: "Interview rate",
      value: getRate(applications, "INTERVIEW"),
      suffix: "%",
    },
    {
      label: "Offer rate",
      value: getRate(applications, "OFFER"),
      suffix: "%",
    },
    {
      label: "This week",
      value: getThisWeekCount(applications),
      suffix: "",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border bg-card text-card-foreground p-4"
        >
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="mt-1 text-3xl font-semibold">
            {stat.value}
            {stat.suffix}
          </p>
        </div>
      ))}
    </div>
  )
}