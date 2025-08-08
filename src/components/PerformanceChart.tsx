import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { name: string; tarefas: number }[];
}

const PerformanceChart: React.FC<Props> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <RTooltip />
        <Bar dataKey="tarefas" fill="hsl(var(--primary))" opacity={0.6} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PerformanceChart;
