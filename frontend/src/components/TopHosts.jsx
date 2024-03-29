import React, { PureComponent } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  entry,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload !== undefined) {
    return (
      <div className="custom-tooltip">
        <p className="desc">Provider: {payload[0].payload.host} </p>
        <p className="desc"># of Times Used: {payload[0].payload.Count}</p>
      </div>
    );
  }
  return null;
};

export default class TopHosts extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width={"100%"} minHeight={300}>
        <PieChart>
          <Pie
            data={this.props.data}
            labelLine={false}
            label={renderCustomizedLabel}
            fill="#8884d8"
            dataKey="Count"
          >
            {this.props.data.map((entry, index) => (
              <Cell
                entry={entry}
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend
            formatter={(value, entry, index) =>
              entry.payload.payload.payload.Host.replace("(", "")
            } // forgive this it is a deeply nested object
          />
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
