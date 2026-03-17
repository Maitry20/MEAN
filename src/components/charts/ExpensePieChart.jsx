import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import Card from '../ui/Card';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];

const ExpensePieChart = ({ data }) => {
  // If no data, show a placeholder gracefully
  if (!data || data.length === 0) {
    return (
      <Card style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 1rem 0', alignSelf: 'flex-start' }}>Category Breakdown</h3>
        <p style={{ color: 'var(--text-secondary)' }}>No expense data available.</p>
      </Card>
    );
  }

  return (
    <Card style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>Category Breakdown</h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => `$${value}`}
              contentStyle={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ExpensePieChart;
