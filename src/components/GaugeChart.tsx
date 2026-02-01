import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface GaugeChartProps {
  value: number;
  maxValue?: number;
  title: string;
  status: "safe" | "warning" | "danger";
}

export function GaugeChart({ value, maxValue = 100, title, status }: GaugeChartProps) {
  const percentage = Math.min((value / maxValue) * 100, 100);
  const data = [
    { value: percentage },
    { value: 100 - percentage },
  ];

  const getColor = () => {
    switch (status) {
      case "danger":
        return "hsl(var(--gauge-danger))";
      case "warning":
        return "hsl(var(--gauge-warning))";
      default:
        return "hsl(var(--gauge-safe))";
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-24">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={55}
              outerRadius={75}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={getColor()} />
              <Cell fill="hsl(var(--gauge-track))" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <span className="text-2xl font-bold text-foreground">
            {value.toFixed(1)}%
          </span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium text-muted-foreground">{title}</span>
    </div>
  );
}
