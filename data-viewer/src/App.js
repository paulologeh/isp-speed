import React, { Component } from 'react';
import { Sidebar, Menu, Grid, Checkbox, Icon, Button, Segment, Card, Image, Header, Modal, Form, Dimmer, Loader} from 'semantic-ui-react';
import { applyfilters, getProviderCummulative, getHostData, dataRecents, filterTime , normaliseAllData} from './utils/dataReducer';
import SpeedChart from './components/SpeedChart';
import ProviderChart from './components/ProviderChart';
import HostPie from './components/TopHosts';
import ActivityFeed from './components/ActivityFeed';
import { isMobile } from './utils/helpers';
import './App.css'

const rootStyle = { minHeight: '100vh' }
const durations = ['24 hours', '7 days', '30 days', 'All Time']

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
    loading: true,
    minimumDownload: 18,
    minimumUpload: 9,
    summary: [
      { meta: 'Change Since Yesterday: 0 %', header: 'Average Download Speed', description: '0 Mbps' },
      { meta: 'Change Since Yesterday: 0 %', header: 'Average Upload Speed', description: '0 Mbps' },
      { meta: 'Change Since Yesterday: 0 %', header: 'Total Number of Tests', description: '0' },
      { meta: '', header: '% of Results Above Threshold', description: '0'}
    ]
  }

  async callAPI() {
    const response = await fetch("https://n4la5x2cx2.execute-api.eu-west-2.amazonaws.com/staging/data");
    const data = await response.json();
    this.setState({ allData: data.recordset });
    let summary = [...this.state.summary];
    summary = applyfilters(summary, data.recordset, this.state.minimumDownload, this.state.minimumUpload, null)
    this.setState({ summary: summary });
    this.setState({ allData: data.recordset })
    this.setState({ data: normaliseAllData(data.recordset) });
    this.setState({ providerData: getProviderCummulative(data.recordset) });
    this.setState({ hostData: getHostData(data.recordset) });
    this.setState({ recents: dataRecents(data.recordset) })
    this.setState({loading: false})
  }

  componentDidMount() {
    console.clear()
    this.callAPI()
    
  }

  componentDidUpdate(prevProps, prevState) {
    const moreData =  this.state.timeDuration === '24 hours' ? this.state.allData : null
    if (prevState.timeDuration !== this.state.timeDuration)
    {
      if (this.state.timeDuration === 'All Time')
      {
        this.callAPI()
      }
      else
      {
        let newdata = filterTime(this.state.allData, this.state.timeDuration)
        let summary = [...this.state.summary];
        summary = applyfilters(this.state.summary, newdata, this.state.minimumDownload, this.state.minimumUpload, moreData)
        this.setState({ summary: summary, data: newdata })
      }
      
    }
    if (prevState.minimumDownload !== this.state.minimumDownload || prevState.minimumUpload !== this.state.minimumUpload)
    {
        let summary = [...this.state.summary];
        summary = applyfilters(this.state.summary, this.state.data, this.state.minimumDownload, this.state.minimumUpload, moreData)
        this.setState({ summary: summary})
    }
  }

  toggleSideBar = () => this.setState((prevState) => ({ showSideBar: !prevState.showSideBar }))
  handleChange = (e, { timeDuration }) => this.setState({ timeDuration })
  handleMinDownload = (event) =>this.setState({ minimumDownload: event.target.value })
  handleMinUpload = (event) => this.setState({ minimumUpload: event.target.value})
  
  render() {
    return (
      <div style={rootStyle}>
        <Dimmer active={this.state.loading} page>
            <Loader />
        </Dimmer>
        <Grid padded columns={1} style={{ height: '100%' }}>
          <Sidebar
            as={Menu}
            animation='push'
            icon='labeled'
            inverted
            vertical={isMobile() ? false : true}
            visible={this.state.showSideBar}
            onHide={() => this.setState({ showSideBar: false })}
            width='thin'
            direction={isMobile() ? 'top' : 'left'}
            style={{maxHeight: isMobile() ? '100px' : null}}
          >
            { isMobile() ? null :
              <Menu.Item as='image'>
                <Image size={'small'} circular src={process.env.PUBLIC_URL + '/profile.jpg'} />
                <br />
                <Menu.Header>Welcome Paul!</Menu.Header>
              </Menu.Item>
            }
              <Menu.Item as='a' onClick={() => { window.location = '/';}}><Icon name='home' />Home</Menu.Item>
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
                    <Header>Duration Filters</Header>
                    {durations.map((duration, i) =>
                      <Form.Field>
                        <Checkbox
                          radio
                          label={duration}
                          name='checkboxRadioGroup'
                          timeDuration={duration}
                          checked={this.state.timeDuration === duration}
                          onChange={this.handleChange}
                        />
                      </Form.Field>)}
                    </Form.Group> 
                    <Form.Group>
                      <Header>Speed Thresholds</Header>
                      <Form.Input key='in1' label='Minimum Download' type='number' value={this.state.minimumDownload} onChange={this.handleMinDownload} />
                      <Form.Input key='in2' label='Minimum Upload'type='number'value={this.state.minimumUpload} onChange={this.handleMinUpload}/>
                    </Form.Group>
                  </Form>
                </Modal.Content>
            </Modal>
            <Menu.Item as='a' href='https://github.com/paulologeh/ISP-Speed/blob/master/README.md'> <Icon name='info' />About</Menu.Item>
            <Menu.Item as='a' href='https://github.com/paulologeh/ISP-Speed'><Icon name='github' />Source Code</Menu.Item>
          </Sidebar>
          <Grid.Column style={{backgroundColor: '#F0F0F0'}}>
            <Grid.Row>
              <Button floated='left' color='black' icon onClick={() => this.setState({ showSideBar: true })}><Icon name='bars' /></Button>
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
              <Grid columns={isMobile() ? 1 : 'equal'}>
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