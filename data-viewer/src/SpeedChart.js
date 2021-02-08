import React, { PureComponent } from 'react';
import {
   ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label
} from 'recharts';
import moment from 'moment'
import './App.css'


const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload !== undefined && payload !== null) {
        const milliseconds = payload[0].payload.RecordTime
        const dateObject = new Date(milliseconds);
        const humanDateFormat = dateObject.toLocaleString();
    return (
        <div className="custom-tooltip">
        <p className="desc">Timestamp: {humanDateFormat} </p>
        <p className="desc">Provider: {payload[0].payload.Provider}</p>
        <p className="desc">Download Speed: {payload[0].payload.Download} Mbps</p>
        <p className="desc">Upload Speed: {payload[0].payload.Upload} Mbps</p>
      </div>
    );
  }

  return null;
};


export default class SpeedChart extends PureComponent {

  render() {
    return (
       <ResponsiveContainer width={"100%"} height={200}>
       <AreaChart
          data={this.props.data}
          margin={{
            top: 10, right: 30, left: 20, bottom: 10,
          }}
        >
          <CartesianGrid />
            <XAxis
                dataKey="RecordTime"
                name='Time'
                domain={['auto', 'auto']}
            tickFormatter={(unixTime) => moment(unixTime).format('HH:mm Do')}
            // https://momentjs.com/docs/
                // type = 'number'
            />
            <YAxis>
              <Label
                value={"Speed (Mbps)"}
                position="left"
                angle={-90}
                style={{ textAnchor: "middle" }}
                />
            </YAxis>
            <Tooltip content={<CustomTooltip />}/>
            <Legend />
            <Area type="monotone" dataKey="Download" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Area type="monotone" dataKey="Upload" stroke="#82ca9d" />
        </AreaChart>
        </ResponsiveContainer>
    );
  }
}
