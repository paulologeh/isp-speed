import React, { PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import moment from 'moment'
import './App.css'


const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload) {
        const milliseconds = payload[0].payload.RecordTime
        const dateObject = new Date(milliseconds);
        const humanDateFormat = dateObject.toLocaleString();
    return (
        <div className="custom-tooltip">
        <p className="desc">Timestamp: {humanDateFormat} </p>
        <p className="desc">Provider: {payload[0].payload.Provider}</p>
        <p className="desc">Download: {payload[0].payload.Download} Mbps</p>
        <p className="desc">Upload: {payload[0].payload.Upload} Mbps</p>
      </div>
    );
  }

  return null;
};


export default class Chart extends PureComponent {

  render() {
    return (
      <LineChart
        width={800}
        height={400}
        data={this.props.data}
        margin={{
          top: 10, right: 30, left: 20, bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="RecordTime"
                name = 'Time'
                domain={['auto', 'auto']}
                tickFormatter = {(unixTime) => moment(unixTime).format('HH:mm Do MM')}
                // type = 'number'
            />
            <YAxis
                name='Speed (Mbps)'
            />
            <Tooltip content={<CustomTooltip />}/>
            <Legend />
            <Line type="monotone" dataKey="Download" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="Upload" stroke="#82ca9d" />
      </LineChart>
    );
  }
}
