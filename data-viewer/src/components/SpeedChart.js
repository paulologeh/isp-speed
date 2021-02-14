import React, { PureComponent } from 'react';
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label} from 'recharts';
import moment from 'moment'
import '../App.css'


const CustomTooltip = ({ active, payload, label, duration }) => {
    if (active && payload !== undefined && payload !== null) {
        const milliseconds = payload[0].payload.RecordTime
        const dateObject = new Date(milliseconds);
        const humanDateFormat = dateObject.toLocaleString();
    return (
        <div className="custom-tooltip">
        {duration === 'All Time' ? null : <p className="desc">Timestamp: {humanDateFormat} </p> }
        { duration === 'All Time' ? null: <p className="desc">Provider: {payload[0].payload.Provider}</p>}
        <p className="desc">Download Speed: {payload[0].payload.Download} Mbps</p>
        <p className="desc">Upload Speed: {payload[0].payload.Upload} Mbps</p>
      </div>
    );
  }

  return null;
};

function calculateInterval(data, duration)
{
  if (duration === '7 days' || duration === '30 days')
  {
    let interval = (data.length / 7).toFixed(0)
    return duration === '7 days' ? parseInt(interval) - 1 : parseInt(interval)
  }
  return 'preserveEnd' 
}


function xAxisTicks(duration, unixTime)
{
  switch (duration)
  {
    case 'All Time':
      return moment(unixTime).format('MMM YY') 
    case '24 hours':
      return moment(unixTime).format('HH:mm') 
    case '7 days':
      return moment(unixTime).format('D MMM') 
    case '30 days':
      return moment(unixTime).format('D MMM') 
    default:
      return null
  }
}


export default class SpeedChart extends PureComponent {

  state = {
    _max: 0
  }

  calculateDomain() {
    let dataMax = 0
    for (let i in this.props.data)
    {
      dataMax = parseFloat(this.props.data[i].Download) > dataMax ? parseFloat(this.props.data[i].Download) : dataMax;
      dataMax = parseFloat(this.props.data[i].Upload) > dataMax ? parseFloat(this.props.data[i].Upload) : dataMax;
    }
    dataMax = parseInt(Math.ceil((dataMax + 10) / 10) * 10)
    this.setState({ _max: dataMax })
  }

  componentDidMount() {
    this.calculateDomain()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props.data)
    {
      this.calculateDomain()  
    }
  }

  render() {
    return (
       <ResponsiveContainer width={"100%"} minHeight={250}>
        <AreaChart
            data={this.props.data}
            margin={{
              top: 5, right: 20, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid />
              <XAxis
                  dataKey="RecordTime"
                  name='Time'
                  domain={['auto', 'auto']}
                  interval={calculateInterval(this.props.data, this.props.duration)}
                  tickFormatter={ (unixTime) => xAxisTicks(this.props.duration, unixTime)}// https://momentjs.com/docs/
              />
              <YAxis  domain={[0, this.state._max]}>
                <Label
                  value={"Speed (Mbps)"}
                  position="left"
                  angle={-90}
                  style={{ textAnchor: "middle" }}
                  />
              </YAxis>
             <Tooltip content={<CustomTooltip duration={this.props.duration }/>}/>
              <Legend />
              <Area type="monotone" dataKey="Download" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Area type="monotone" dataKey="Upload" stroke="#82ca9d" />
          </AreaChart>
        </ResponsiveContainer>
    );
  }
}