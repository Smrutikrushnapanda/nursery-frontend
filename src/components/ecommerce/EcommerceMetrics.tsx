"use client"

import {
  BoxIconLine,
  DollarLineIcon,
  GroupIcon,
  ShootingStarIcon,
} from "@/icons"

const metrics = [
  {
    title: "Total Plants",
    value: "12,540",
    icon: BoxIconLine,
    trend: "+12%",
    bgColor: "bg-brand-50",
    iconColor: "text-brand-600",
    borderColor: "border-brand-200",
    gradientFrom: "from-brand-500",
    gradientTo: "to-brand-300",
  },
  {
    title: "Today's Sales",
    value: "$1,240",
    icon: DollarLineIcon,
    trend: "+8%",
    bgColor: "bg-success-50",
    iconColor: "text-success-600",
    borderColor: "border-success-200",
    gradientFrom: "from-success-500",
    gradientTo: "to-success-300",
  },
  {
    title: "Sold Today",
    value: "86",
    icon: GroupIcon,
    trend: "+5%",
    bgColor: "bg-blue-light-50",
    iconColor: "text-brand-500",
    borderColor: "border-blue-light-200",
    gradientFrom: "from-brand-500",
    gradientTo: "to-brand-300",
  },
  {
    title: "Total Inventory",
    value: "8,320",
    icon: ShootingStarIcon,
    trend: "-3%",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
    borderColor: "border-orange-200",
    gradientFrom: "from-orange-500",
    gradientTo: "to-orange-300",
  },
]

export const EcommerceMetrics = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 md:gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon

        return (
          <div
            key={metric.title}
            className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-theme-xs transition-all duration-300 hover:shadow-theme-lg"
          >
            {/* Multi-layer border effect */}
            <div className={`absolute inset-0 rounded-2xl border-2 ${metric.borderColor} opacity-40`} />
            <div className={`absolute inset-0.5 rounded-xl border ${metric.borderColor} opacity-60`} />
            <div className="absolute inset-2 rounded-lg border border-dashed border-brand-100/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            {/* Top accent border with gradient */}
            <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${metric.gradientFrom} ${metric.gradientTo} rounded-t-2xl`} />
            
            {/* Corner accent */}
            <div className={`absolute -top-1 -right-1 h-8 w-8 rounded-full bg-gradient-to-br ${metric.gradientFrom} ${metric.gradientTo} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20`} />
            
            {/* Background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-brand-25/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-600">
                    {metric.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                      metric.trend.startsWith('+') 
                        ? 'bg-success-50 text-success-700 border border-success-200' 
                        : 'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}>
                      {metric.trend}
                    </span>
                    <span className="text-xs text-gray-400">vs last week</span>
                  </div>
                </div>

                <div className={`relative h-12 w-12 flex items-center justify-center rounded-xl ${metric.bgColor} border-2 ${metric.borderColor} shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}>
                  <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${metric.gradientFrom} ${metric.gradientTo} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />
                  <Icon className={`size-6 ${metric.iconColor} transition-transform duration-300 group-hover:rotate-6`} />
                </div>
              </div>

              <div className="mt-4 flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {metric.value}
                  </h2>
                  <div className="mt-1 flex items-center gap-1">
                    <div className={`h-1 w-1 rounded-full ${metric.iconColor.replace('text', 'bg')}`} />
                    <span className="text-xs text-gray-500">Updated today</span>
                  </div>
                </div>
                
                {/* Mini sparkline bars */}
                <div className="flex items-end gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-300 ${
                        metric.trend.startsWith('+')
                          ? 'bg-gradient-to-t from-success-400 to-success-300'
                          : 'bg-gradient-to-t from-orange-400 to-orange-300'
                      } ${i === 3 ? 'opacity-50' : 'opacity-100'}`}
                      style={{
                        height: `${[16, 24, 12, 20][i]}px`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mt-4 flex items-center gap-3">
                <div className="h-1.5 flex-1 rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${metric.gradientFrom} ${metric.gradientTo} transition-all duration-500`}
                    style={{ width: metric.trend.startsWith('+') ? '78%' : '42%' }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-500">
                  {metric.trend.startsWith('+') ? '78%' : '42%'}
                </span>
              </div>

              {/* Decorative bottom dots */}
              <div className="absolute -bottom-1 -right-1 flex gap-0.5 opacity-20">
                <div className={`h-1.5 w-1.5 rounded-full ${metric.iconColor.replace('text', 'bg')}`} />
                <div className={`h-1.5 w-1.5 rounded-full ${metric.iconColor.replace('text', 'bg')} opacity-60`} />
                <div className={`h-1.5 w-1.5 rounded-full ${metric.iconColor.replace('text', 'bg')} opacity-30`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}