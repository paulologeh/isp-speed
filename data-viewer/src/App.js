import React, { Component } from 'react';
import { Container, Header, Image, Menu, Dropdown, Segment, Button, Icon } from 'semantic-ui-react';
import Chart from './Chart';

const SpeedArticle = () => {
  return (
        <p>
          The struggle for good internet in London is real. Especially if you are in a very densely populated area e.g E1.
          Since we have all been locked down and a lot of people have transitioned to working from home, reliable internet has become crucial.
          Unfortunateley for me, this has not been the case. My internet was so unreliable and could barely use it past 12:00.
          Hence, I decided to schedule jobs to monitor the speed of my connection wheneve my laptop is on and have been collecting this data since June 2019.
          The chart below will show the download/upload speed of my internet service provider. I have switched between Three, TalkTalk, EE and Vodafone since then.
        </p>
  )
}


class App extends Component {

  state = {
    data: [],
    currentData: [],
    activeItem: 'Info',
    tabColor: 'blue',
    lastUpdateTime: '06-02-2021 20:33:00',
    dataPoints: 20,
    cutoff: null
  }

  async callAPI() {
    const response = await fetch("http://localhost:3600/api/data");
    const data = await response.json();
    console.debug('API returned')
    console.debug(data.recordset)
    this.setState({ data: data.recordset })
    console.log(data)
  }

  componentDidMount() {
    console.clear()
    this.callAPI()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.activeItem !== prevState.activeItem) {
      this.handleData();
    }
  }

  handleData = () => {
    if (!this.state.dataPoints) {
      return;
    }
    let newData = [...this.state.data];
    let n = newData.length - 1;
    newData = newData.slice(n - this.state.dataPoints, n);
    newData.forEach(function (v) {
      delete v.ID;
      delete v.Host;
      v.RecordTime = new Date(v.RecordTime).getTime();
    });
    console.log('handled data')
    this.setState({ currentData: newData });
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  router() {
    console.debug(this.state.activeItem)
    switch (this.state.activeItem) {
      case 'Data':
        return <Chart data={this.state.currentData}/>
      default:
        return <SpeedArticle  />
    }
  }

  render() {
    const activeItem = this.state.activeItem;

    return (
      <div>
        <style>
          {`
          html, body {
            background: #fff;
          }
        `}
        </style>
        <Container text style={{ marginTop: '2em' }}>
          <Image src={process.env.PUBLIC_URL + '/speedguage.png'} size={'small'} inline={true}/>
          <Header as='h1'>ISP Speed Tracker</Header>
          <p>Making sure ISPs meet their minimum speed commitments</p>
        </Container>
        <Container style={{ marginTop: '6em' }}>
          <Menu
            pointing
            secondary
            attached='top'
          >
            <Menu.Item as='a' name='Info' active={activeItem === 'Info'} onClick={this.handleItemClick}>Info</Menu.Item>
            <Menu.Item as='a' name='Data' active={activeItem === 'Data'} onClick={this.handleItemClick}>Data</Menu.Item>
            <Menu.Item as='a' name='ISP Performance' active={activeItem === 'ISP Performance'} onClick={this.handleItemClick}>ISP Performance</Menu.Item>
            <Menu.Item as='a' name='Reports' active={activeItem === 'Reports'} onClick={this.handleItemClick}>Reports</Menu.Item>
            {activeItem === 'Data' ?
              <Menu.Menu position='right'>
                <Dropdown item text='Filter by Duration' >
                  <Dropdown.Menu>
                    <Dropdown.Item>Show Last 24 Hours</Dropdown.Item>
                    <Dropdown.Item>Show Last 7 Days</Dropdown.Item>
                    <Dropdown.Item>Show Last 30 Days</Dropdown.Item>
                    <Dropdown.Item>Show All</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown> 
                <Dropdown item text='Filter by ISP' >
                  <Dropdown.Menu>
                    <Dropdown.Item>EE</Dropdown.Item>
                    <Dropdown.Item>Vodafone</Dropdown.Item>
                    <Dropdown.Item>Three</Dropdown.Item>
                    <Dropdown.Item>TalkTalk</Dropdown.Item>
                    <Dropdown.Item>All</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown> 
              </Menu.Menu>
              : null
             }
          </Menu>

          <Segment attached='bottom'>
            {this.router()}
          </Segment>

          <Button
            color='black'
            href='https://github.com/paulologeh/ISP-Speed'
          >
            <Icon name='github' />
            Source Code
          </Button> 

          </Container>
      </div>
    )
  }
}

export default App;