import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ContributionData {
  name: string;
  value: number;
  color: string;
}

interface ContributionChartProps {
  newLoanContribution: number;
  existingLoansContribution: number;
  totalAnnualRepayment: number;
}

export function ContributionChart({ 
  newLoanContribution, 
  existingLoansContribution,
  totalAnnualRepayment 
}: ContributionChartProps) {
  const data: ContributionData[] = [
    { 
      name: "신규 대출", 
      value: newLoanContribution, 
      color: "hsl(190 95% 55%)" 
    },
    { 
      name: "기존 대출", 
      value: existingLoansContribution, 
      color: "hsl(270 80% 65%)" 
    },
  ].filter(item => item.value > 0);

  const formatCurrency = (value: number) => {
    if (value >= 10000) {
      return `${(value / 10000).toFixed(0)}만원`;
    }
    return `${value.toLocaleString("ko-KR")}원`;
  };

  if (totalAnnualRepayment === 0) {
    return null;
  }

  return (
    <motion.div 
      className="glass rounded-xl p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h4 className="text-sm font-semibold text-foreground mb-3 text-center">
        DSR 기여도 분석
      </h4>
      
      <div className="flex items-center justify-center gap-4">
        <div className="w-24 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={40}
                paddingAngle={4}
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="glass-strong rounded-lg px-3 py-2 text-xs">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-muted-foreground">{formatCurrency(item.value)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-2">
          {data.map((item, index) => (
            <motion.div 
              key={item.name}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <div className="text-xs">
                <span className="text-muted-foreground">{item.name}</span>
                <span className="ml-2 font-medium text-foreground">
                  {((item.value / totalAnnualRepayment) * 100).toFixed(1)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
