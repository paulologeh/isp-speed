import React, { Component } from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineMarkSeries } from 'react-vis';

class Plot extends Component{
    render() {
        return (
        <XYPlot width={500} height={300}>
            <HorizontalGridLines />
            <LineMarkSeries
                color="red"
                data={[
                {x: 1, y: 5},
                {x: 2, y: 10},
                {x: 3, y: 15}
                ]}/>
            <XAxis title="Date-Time" />
            <YAxis title="Speed (Mbps)"/>
        </XYPlot>
    )
}
}

export default Plot;