import React, { Component } from 'react';
import { XYPlot, XAxis, YAxis, HorizontalGridLines, LineSeriesCanvas, VerticalGridLines } from 'react-vis';
import '../node_modules/react-vis/dist/style.css';
import { Button, Dropdown, Statistic } from 'semantic-ui-react';


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
        tickCount: Infinity,
        // data: null
    }

    toggleView = (e, data) => {
        if (this.state.view === 'Download') {
            this.setState({ view: 'Upload', data: this.props.upload });
        }
        else {
            this.setState({ view: 'Download', data: this.props.download  });
        }
    }

    setTickCount = (e, data) => {
        this.setState({tickCount: data.value})
    }

    OptionPanel = () => {
        return (
            <div>
                <Button onClick={this.toggleView} color={this.props.parentColor}>Show {this.state.view === 'Download' ? 'Upload' : 'Download'}</Button>
                <Dropdown
                    text='Data Filter'
                    icon='filter'
                    floating
                    labeled
                    button
                    className='icon'
                >
                    <Dropdown.Menu>
                        <Dropdown.Header icon='tags' content='Filter By Days' />
                        <Dropdown.Divider />
                        <Dropdown.Item
                            label={{ color: 'red', empty: true, circular: true }}
                            text='Last 24 hours'
                            value={24+1}
                            onClick={this.setTickCount}
                        />
                        <Dropdown.Item
                            label={{ color: 'blue', empty: true, circular: true }}
                            text='Last 7 days'
                            value={7*(24+1)}
                            onClick={this.setTickCount}
                        />
                        <Dropdown.Item
                            label={{ color: 'black', empty: true, circular: true }}
                            text='Last 30 days'
                            value={30*(24+1)}
                            onClick={this.setTickCount}
                        />
                    </Dropdown.Menu>
                </Dropdown>
                <Statistic size={'mini'}>
                    <Statistic.Value>Average: {this.average(this.dataReducer())} Mbps</Statistic.Value>
                </Statistic>
            </div >
        )
    }

    dataReducer = () => {
        if (this.state.tickCount === Infinity){
            return this.state.view === 'Upload' ? this.props.upload : this.props.download
        }
        else{
            let length = this.props.download.length;
            return this.state.view === 'Download' ? this.props.download.slice(length - this.state.tickCount,length) : this.props.upload.slice(length - this.state.tickCount,length)
        }
    }

    average = (data) => {
        if (data === null){
            return null
        }
        let avg = 0;
        for (let i = 0; i < data.length; i++){
            avg += data[i].y;
        }
        avg = avg / (data.length - 1)
        return Math.round(avg * 100) / 100
    }

    render() {

        return (
            <>
                {this.OptionPanel()}
                <XYPlot 
                width={900}
                height={500}
                xType={"time"}
                margin={{ bottom: 100 }}
                >
                    <HorizontalGridLines />
                    <VerticalGridLines />
                    <XAxis
                        hideLine
                        tickLabelAngle={-30}
                        style={axisStyle}
                    />
                    <YAxis
                        hideLine
                        title="Speed (Mbps)"
                        style={axisStyle}
                    />
                    <LineSeriesCanvas
                        style={{ strokeWidth: 5 }}
                        curve={'curveBasis'}
                        data={this.dataReducer()}
                    />
                </XYPlot>
            </>
        )
    }
}

export default Plot;