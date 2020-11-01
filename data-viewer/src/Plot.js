import React, { Component } from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeriesCanvas, VerticalGridLines } from 'react-vis';
import '../node_modules/react-vis/dist/style.css';
import { Button, Dropdown } from 'semantic-ui-react';


const print = (text) => {
    console.log(text)
}

const axisStyle = {
    ticks: {
        color: '#333'
    },
    title: {
        color: '#333'
    }
};


class Plot extends Component {

    state = {
        view: 'Download',
        tickCount: 7
    }

    toggleView = (e, data) => {
        if (this.state.view === 'Download') {
            this.setState({ view: 'Upload' });
        }
        else {
            this.setState({ view: 'Download' });
        }
    }

    OptionPanel = () => {
        return (
            <div>
                <Button onClick={this.toggleView} color={this.props.parentColor}>Show {this.state.view === 'Download' ? 'Upload' : 'Download'}</Button>
                <Dropdown
                    text='Filter By Date'
                    icon='filter'
                    floating
                    labeled
                    button
                    className='icon'
                >
                    <Dropdown.Menu>
                        <Dropdown.Header icon='tags' content='Filter Dates' />
                        <Dropdown.Divider />
                        <Dropdown.Item
                            label={{ color: 'red', empty: true, circular: true }}
                            text='Last 24 hours'
                        />
                        <Dropdown.Item
                            label={{ color: 'blue', empty: true, circular: true }}
                            text='Last 7 days'
                        />
                        <Dropdown.Item
                            label={{ color: 'black', empty: true, circular: true }}
                            text='Last 30 days'
                        />
                        <Dropdown.Item
                            label={{ color: 'green', empty: true, circular: true }}
                            text='Custom Dates'
                        />
                    </Dropdown.Menu>
                </Dropdown>
            </div >
        )
    }


    render() {

        return (
            <>
                {this.OptionPanel()}
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
                    <YAxis
                        hideLine
                        title="Speed (Mbps)"
                        style={axisStyle}
                    />
                    <LineSeriesCanvas
                        animation
                        style={{ strokeWidth: 5 }}
                        curve={'curveBasis'}
                        data={this.state.view === 'Upload' ? this.props.upload : this.props.download}
                    />
                </XYPlot>
            </>
        )
    }
}

export default Plot;