import React, { PureComponent } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default class ProviderChart extends PureComponent {
  state = {
    xMax: 0,
  };

  calculateDomain() {
    let dataMax = 0;
    for (let i in this.props.data) {
      dataMax =
        parseFloat(this.props.data[i].download) > dataMax
          ? parseFloat(this.props.data[i].download)
          : dataMax;
      dataMax =
        parseFloat(this.props.data[i].upload) > dataMax
          ? parseFloat(this.props.data[i].upload)
          : dataMax;
    }
    dataMax = parseInt(dataMax + 1);
    this.setState({ xMax: dataMax });
  }

  componentDidMount() {
    this.calculateDomain();
  }

  componentDidUpdate(prevState, prevProps) {
    if (prevProps !== this.props.state) {
      this.calculateDomain();
    }
  }

  render() {
    return (
      <ResponsiveContainer width={"100%"} minHeight={300}>
        <ComposedChart
          layout="vertical"
          data={this.props.data}
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <XAxis type="number" domain={[0, this.state.xMax]} />
          <YAxis dataKey="provider" type="category" padding={{ bottom: 25 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="download" barSize={20} fill="#413ea0" />
          <Bar dataKey="upload" barSize={20} fill="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}
