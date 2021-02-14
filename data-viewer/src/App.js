import React, { Component } from 'react';
import './App.css'
import { Grid,  Icon, Button, Segment, Header,  Dimmer, Loader} from 'semantic-ui-react';
import { Mobile} from './utils/index';
import SpeedChart from './components/SpeedChart';
import ProviderChart from './components/ProviderChart';
import HostPie from './components/TopHosts';
import ActivityFeed from './components/ActivityFeed';
import BarMenu from './components/BarMenu';
import Metrics from './components/Metrics';
import { getRecentTests, getHostData, filterTime, getProviderCummulative, getAllTimeData, getSummary} from './data/index'


const rootStyle = { minHeight: '100vh', backgroundColor: '#F0F0F0' }


class App extends Component {

  state = {
    allData: [],
    data: [],
    providerData: [],
    hostData: [],
    recents: [],
    sidebar: true,
    customise: false,
    duration: 'All Time',
    loading: true,
    minimumDownload: 18,
    minimumUpload: 9,
    summary: [
      { meta: 'Change Since Yesterday: 0 %', header: 'Average Download Speed', description: '0 Mbps' },
      { meta: 'Change Since Yesterday: 0 %', header: 'Average Upload Speed', description: '0 Mbps' },
      { meta: 'Tests Today: 0', header: 'Total Number of Tests', description: '0' },
      { meta: '', header: '% of Results Above Threshold', description: '0'}
    ]
  }

  async callAPI() {
    const response = await fetch("https://n4la5x2cx2.execute-api.eu-west-2.amazonaws.com/staging/data");
    const data = await response.json();
    this.setState({ allData: data.recordset });
    let summary = [...this.state.summary];
    summary = getSummary(summary, data.recordset, this.state.minimumDownload, this.state.minimumUpload, null)
    this.setState({ summary: summary });
    this.setState({ allData: data.recordset })
    this.setState({ data: getAllTimeData(data.recordset) });
    this.setState({ providerData: getProviderCummulative(data.recordset) });
    this.setState({ hostData: getHostData(data.recordset) });
    this.setState({ recents: getRecentTests(data.recordset) })
    this.setState({loading: false})
  }

  componentDidMount() {
    console.clear()
    this.callAPI()
    
  }

  componentDidUpdate(prevProps, prevState) {
    const duration = this.state.duration;
    const moreData =  duration === '24 hours' ? this.state.allData : null
    if (prevState.duration !== duration)
    {
      if (duration === 'All Time')
      {
        this.callAPI()
      }
      else
      {
        let newData = filterTime(this.state.allData, duration)
        let summary = [...this.state.summary];
        summary = getSummary(summary, newData, this.state.minimumDownload, this.state.minimumUpload, moreData)
        this.setState({ summary: summary, data: newData })
      }
      
    }
    if (prevState.minimumDownload !== this.state.minimumDownload || prevState.minimumUpload !== this.state.minimumUpload)
    {
      let summary = [...this.state.summary];
      const data = duration === 'All Time' ? this.state.allData : this.state.data
      summary = getSummary(summary, data, this.state.minimumDownload, this.state.minimumUpload, moreData)
      this.setState({ summary: summary })
    }
  }

  toggleSideBar = () => this.setState((prevState) => ({ sidebar: !prevState.sidebar }))
  handleChange = (event, data) => this.setState({ duration: data.duration })
  handleMinDownload = (event) =>this.setState({ minimumDownload: event.target.value })
  handleMinUpload = (event) => this.setState({ minimumUpload: event.target.value})
  
  render() {
    const duration = this.state.duration

    return (
      <div style={rootStyle}>
        <Dimmer active={this.state.loading} page>
            <Loader />
        </Dimmer>
        <Grid padded columns={1} style={{ height: '100%' }}>
          <BarMenu
            sidebar={this.state.sidebar}
            handleSidebar={(value) => this.setState({ sidebar: value })}
            customise={this.state.customise}
            handleModal={(value) => this.setState({ customise: value })}
            currentDuration={duration}
            handleDuration={this.handleChange}
            minDownload={this.state.minimumDownload}
            minUpload={this.state.minimumUpload}
            handleDownload={this.handleMinDownload}
            handleUpload={this.handleMinUpload}
          />
          <Grid.Column>
            <Grid.Row>
              <Button floated='left' color='black' icon onClick={() => this.setState({ sidebar: true })}><Icon name='bars' /></Button>
            </Grid.Row>
            <Grid.Row centered>
              <Metrics summary={this.state.summary}/>
            </Grid.Row>
            <Grid.Row>
              <br/>
              <Segment>
                <Header as='h3' textAlign='center'>Speed Chart</Header>
                <SpeedChart duration={duration} data={this.state.data}/>
              </Segment>
            </Grid.Row>
            <Grid.Row>
              <br />
              <Grid columns={Mobile() ? 1 : 'equal'}>
                <Grid.Column>
                  <Segment>
                    <Header as='h3' textAlign='center'>Average Cummulative Speed By Provider</Header>
                    <ProviderChart data={this.state.providerData} />
                  </Segment>    
                </Grid.Column>
                <Grid.Column> 
                  <Segment>
                    <Header as='h3' textAlign='center'>Top 4 Used Hosts</Header>
                    <HostPie data={this.state.hostData}/>
                  </Segment>
                </Grid.Column>
                <Grid.Column>
                  <Segment>
                    <Header as='h3' textAlign='center'>Recent Test Activity</Header>
                    <ActivityFeed data={this.state.recents} />
                  </Segment>
                </Grid.Column>
              </Grid>
            </Grid.Row>
          </Grid.Column>
          </Grid>
      </div>
    )
  }
}

export default App;