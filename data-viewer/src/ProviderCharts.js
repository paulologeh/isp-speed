import React, { PureComponent } from 'react';
import {
  ComposedChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,Legend,
} from 'recharts';

const data = [
  {
    name: 'Page A', uv: 590, pv: 800, amt: 1400,
  },
  {
    name: 'Page B', uv: 868, pv: 967, amt: 1506,
  },
  {
    name: 'Page C', uv: 1397, pv: 1098, amt: 989,
  },
  {
    name: 'Page D', uv: 1480, pv: 1200, amt: 1228,
  },
  {
    name: 'Page E', uv: 1520, pv: 1108, amt: 1100,
  },
  {
    name: 'Page F', uv: 1400, pv: 680, amt: 1700,
  },
];

export default class ProviderChart extends PureComponent {

  render() {
    // console.log(this.props.data)
    return (
       <ResponsiveContainer width={"100%"} height={300}>
      <ComposedChart
        layout="vertical"
          data={this.props.data}
          // data={data}
        margin={{
          top: 20, right: 20, bottom: 20, left: 20,
        }}
      >
        <XAxis type="number" />
          <YAxis dataKey="Provider" type="category" padding={{ bottom: 15 }} />
          <Tooltip/>
        <Legend />
        <Bar dataKey="Download" barSize={10} fill="#413ea0" />
        <Bar dataKey="Upload" barSize={10} fill="#ff7300" />
        </ComposedChart>
        </ResponsiveContainer>
    );
  }
}
