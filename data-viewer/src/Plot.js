import React, { Component } from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeriesCanvas, VerticalGridLines } from 'react-vis';
import '../node_modules/react-vis/dist/style.css';


const axisStyle = {
    ticks: {
        color: '#333'
    },
    title: {
        color: '#333'
    }
};

class Plot extends Component {

    render() {
        return (
            <XYPlot
                animation
                width={900}
                height={500}
                xType={"ordinal"}
                margin={{ bottom: 100 }}
            >
                <HorizontalGridLines />
                <VerticalGridLines />
                <XAxis
                    hideLine
                    title="Time"
                    tickLabelAngle={-30}
                    tickFormat={tick => tick}
                    style={axisStyle}
                />
                <YAxis />
                <LineSeriesCanvas
                    animation
                    style={{ strokeWidth: 5 }}
                    curve={'curveBasis'}
                    data={this.props.download}
                />
            </XYPlot>
        )
    }
}

export default Plot;