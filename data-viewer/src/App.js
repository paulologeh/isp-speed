import React, { Component } from 'react';
import { Sidebar, Menu, Grid, Checkbox, Icon, Button, Segment, Card, Image, Header, Modal, Form} from 'semantic-ui-react';
import './App.css'
import { propAverage, countToday, getProviderCummulative, getHostData, dataRecents, filterTime , normaliseAllData} from './utils/dataReducer';
import SpeedChart from './components/SpeedChart';
import ProviderCharts from './components/ProviderCharts';
import HostPie from './components/HostChart';
import ActivityFeed from './components/ActivityFeed';

const rootStyle = {
  height: '100vh',
  minHeight : '100vh'
}


class App extends Component {

  state = {
    allData: [],
    dataNorm: [],
    data: [],
    providerData: [],
    open: false,
    hostData: [],
    recents: [],
    showSideBar: true,
    timeDuration: 'All Time',
    summary: [
      { meta: 'Change Since Yesterday: 0 %', header: 'Average Download Speed', description: '0 Mbps' },
      { meta: 'Change Since Yesterday: 0 %', header: 'Average Upload Speed', description: '0 Mbps' },
      { meta: 'Change Since Yesterday: 0 %', header: 'Number of Tests Today', description: '0' },
      { meta: 'Change Since Yesterday: 0 %', header: 'Total Number of Tests', description: '0' }
    ]
  }

  async callAPI() {
    const response = await fetch("https://n4la5x2cx2.execute-api.eu-west-2.amazonaws.com/staging/data");
    const data = await response.json();
    console.debug('API returned')
    console.debug(data.recordset)
    this.setState({ allData: data.recordset });
    let summary = [...this.state.summary];
    let avgDownloadToday = propAverage(data.recordset, 'Download', false);
    let avgDownloadYesterday = propAverage(data.recordset, 'Download', true);
    let pctChangeDownload = (avgDownloadToday - avgDownloadYesterday) / avgDownloadYesterday * 100;
    let avgUploadToday = propAverage(data.recordset, 'Upload', false);
    let avgUploadYesterday = propAverage(data.recordset, 'Upload', true);
    let pctChangeUpload = avgUploadYesterday ? (avgUploadToday - avgUploadYesterday) / avgUploadYesterday * 100 : 0;
    let testsToday = countToday(data.recordset, false);
    let testsYesterday = countToday(data.recordset, true);
    let pctChangeTests = testsYesterday ? (testsToday - testsYesterday) / testsYesterday * 100 : 0;
    let pctChangeTotal = data.recordset.length ? (data.recordset.length - testsToday) / data.recordset.length : 0;
    summary[0].description = avgDownloadToday + ' Mbps';
    summary[0].meta = 'Change Since Yesterday: ' + pctChangeDownload.toFixed(1) + ' %';
    summary[1].description = avgUploadToday + ' Mbps';
    summary[1].meta = 'Change Since Yesterday: ' + pctChangeUpload.toFixed(1) + ' %';
    summary[2].description = testsToday;
    summary[2].meta = 'Change Since Yesterday: ' + pctChangeTests.toFixed(1) + ' %';
    summary[3].description = data.recordset.length;
    summary[3].meta = 'Change Since Yesterday: ' + pctChangeTotal.toFixed(1) + ' %';
    this.setState({ summary: summary });
    this.setState({ allData: data.recordset })
    this.setState({ data: normaliseAllData(data.recordset) });
    this.setState({ providerData: getProviderCummulative(data.recordset) });
    this.setState({ hostData: getHostData(data.recordset) });
    this.setState({ recents: dataRecents(data.recordset) })
  }

  componentDidMount() {
    console.clear()
    this.callAPI()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.timeDuration !== this.state.timeDuration)
    {
      if (this.state.timeDuration === 'All Time')
      {
          this.setState({ data: normaliseAllData(this.state.allData) });
      }
      else
      {
        this.setState({ data: filterTime(this.state.allData, this.state.timeDuration)})
      }
      
    }
  }

  toggleSideBar = () => this.setState((prevState) => ({ showSideBar: !prevState.showSideBar }))

  handleChange = (e, { timeDuration}) => this.setState({ timeDuration })
  
  render() {

    console.log('hello world')
    return (
      <div style={rootStyle}>
      <Grid padded columns={1} style={{ height: '100%' }}>
        <Sidebar
          as={Menu}
          animation='push'
          icon='labeled'
          inverted
          vertical
          visible={this.state.showSideBar}
          onHide={()=> this.setState({showSideBar: false})}
          width='thin'
        >
          <Menu.Item as='image'>
            <Image size='small' circular src={process.env.PUBLIC_URL + '/profile.jpg'} />
            <br/>
            <Menu.Header>Welcome Paul!</Menu.Header>
          </Menu.Item>
            <Menu.Item as='a' onClick={() => { window.location = '/';}}>
            <Icon name='home' />
            Home
          </Menu.Item>
          <Modal
            closeIcon
            open={this.state.open}
            trigger={<Menu.Item as='a'><Icon name='edit outline' />Customize</Menu.Item>}
            onClose={() => this.setState({ open: false })}
            onOpen={() => this.setState({ open: true })}
          >
            <Header icon='edit' content='Customise Data' />
              <Modal.Content>
                <Form>
                  <Form.Group>
                  <Header>Speed Chart Time Filters</Header>
                  <Form.Field>
                    <Checkbox
                      radio
                      label='24 hours'
                      name='checkboxRadioGroup'
                      timeDuration='24 hours'
                      checked={this.state.timeDuration === '24 hours'}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      radio
                      label='7 days'
                      name='checkboxRadioGroup'
                      timeDuration='7 days'
                      checked={this.state.timeDuration === '7 days'}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      radio
                      label='30 days'
                      name='checkboxRadioGroup'
                      timeDuration='30 days'
                      checked={this.state.timeDuration === '30 days'}
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                  <Form.Field>
                    <Checkbox
                      radio
                      label='All Time'
                      name='checkboxRadioGroup'
                      timeDuration='All Time'
                      checked={this.state.timeDuration === 'All Time'}
                      onChange={this.handleChange}
                    />
                    </Form.Field>
                    </Form.Group>
                </Form>
              </Modal.Content>
          </Modal>
          <Menu.Item as='a'>
            <Icon name='info' />
            About
          </Menu.Item>
          <Menu.Item as='a' href='https://github.com/paulologeh/ISP-Speed'>
            <Icon name='github' />
            Source Code
          </Menu.Item>
        </Sidebar>
          <Grid.Column style={{backgroundColor: '#F0F0F0'}}>
            <Grid.Row>
              <Button color='black' icon onClick={() => this.setState({ showSideBar: true })}><Icon name='bars' /></Button>
            </Grid.Row>
            <Grid.Row centered>
              <Card.Group centered items={this.state.summary}/>
            </Grid.Row>
            <Grid.Row>
              <br/>
              <Segment>
                <Header as='h3' textAlign='center'>Speed Chart</Header>
                <SpeedChart timeDuration={this.state.timeDuration} data={this.state.data}/>
              </Segment>
            </Grid.Row>
            <Grid.Row>
              <br />
              <Grid columns='equal'>
                <Grid.Column>
                  <Segment>
                    <Header as='h3' textAlign='center'>Average Cummulative Speed By Provider</Header>
                    <ProviderCharts data={this.state.providerData} />
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