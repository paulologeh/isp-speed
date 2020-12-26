import React, { Component } from 'react';
import { Container, Modal, Button, Header, Menu, Segment, Image, Grid, Icon } from 'semantic-ui-react';
import Papa from 'papaparse';
import Plot from './Plot';
import './App.css';


const print = (text) => {
  console.log(text)
}

const tabColors = {
  All: 'blue',
  EE: 'teal',
  Vodafone: 'red',
  Three: 'black',
  TalkTalk: 'grey',
  VPN: 'purple'
}

const ISPBanner = () => {
  return (
    <Container>
      <Grid columns={4}>
        <Grid.Row centered>
          <Grid.Column>
            <Image src='EE.jpg' size='tiny' />
          </Grid.Column>
          <Grid.Column>
            <Image src='Three.png' size='tiny' />
          </Grid.Column>
          <Grid.Column>
            <Image src='Vodafone.png' size='tiny' />
          </Grid.Column>
          <Grid.Column>
            <Image src='TalkTalk.jpg' size='tiny' />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  )
}


function WhatIsThis() {
  const [open, setOpen] = React.useState(false)

  return (
    <Modal
      centered={false}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      trigger={<Button>About</Button>}
    >
      <Modal.Header>What Is This?</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          This tool tracks the speed of my internet service provider.
          It runs an internet speed test every hour and stores this data.
          I have had multiple ISPs and wanted to compare their performance and figure out who the best is.
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>OK</Button>
      </Modal.Actions>
    </Modal>
  )
}

class App extends Component {

  state = {
    activeTab: 'All',
    csvData: null,
    upload: null,
    download: null,
    lastTime: null
  };

  componentDidMount() {
    console.clear()
    this.GetData();
    print('Fetched and filtered data')
  }

  async GetData() {
    const data = Papa.parse(await this.fetchCsv());
    this.setState({ csvData: data })
    this.filterData('All', data.data)
    let N = data.data.length - 2;
    let temp = data.data[N]
    let lastUpdate = `${temp[0]} ${temp[1]}`;
    this.setState({ lastTime: lastUpdate })
    return data;
  }

  async fetchCsv() {
    const response = await fetch('speed_data.csv');
    const reader = response.body.getReader();
    const result = await reader.read();
    const decoder = new TextDecoder('utf-8');
    const csv = decoder.decode(result.value);
    return csv;
  }

  filterData = (name, rawData) => {
    let uploads = [];
    let downloads = [];
    let avgDownload = 0;
    let avgUpload = 0;
    const Data = (rawData !== null) ? [...rawData] : this.state.csvData.data;
    let N = Data.length - 1;
    // let count = 0;
    let noneCount = 0;

    for (let i = N - 1; i > 0; i--) {
      let datapoint = Data[i];
      if (datapoint[5] === 'none') {
        noneCount++;
        if (noneCount === 3) {
          noneCount = 0;
          continue;
        }
      }
      if (datapoint[5] === 'none' && !(i % 3 === 0)) {
        continue;
      }
      if (name === 'EE' && datapoint[5] !== 'EE') {
        continue;
      }
      if (name === 'TalkTalk' && datapoint[5] !== 'TalkTalk') {
        continue;
      }
      if (name === 'Three' && datapoint[5] !== 'Three') {
        continue;
      }
      if (name === 'Vodafone' && datapoint[5] !== 'Vodafone') {
        continue;
      }
      let All = ['EE', 'TalkTalk', 'Three', 'Vodafone']
      if (name === 'VPN' && All.includes(datapoint[5])) {
        continue;
      }

      datapoint[2] = (isNaN(datapoint[2]) || datapoint[2] === '') ? 0 : datapoint[2];
      datapoint[3] = (isNaN(datapoint[3]) || datapoint[3] === '') ? 0 : datapoint[3];
      avgDownload += parseFloat(datapoint[2]);
      avgUpload += parseFloat(datapoint[3]);
      let time = datapoint[0] + " " + datapoint[1];
      time = new Date(time)

      if (i % 3 === 0 && i !== 0) {
        avgDownload = avgDownload / 3;
        avgUpload = avgUpload / 3;
        downloads.unshift({ x: time, y: avgDownload });
        uploads.unshift({ x: time, y: avgUpload });
        avgDownload = 0;
        avgUpload = 0;
      }
      // count++;

      // if (count < 24*3) {
      //   // break;
      // }
    }


    this.setState({ download: downloads, upload: uploads });
  }

  handleTabClick = (e, { name }) => {
    print(`clicked ${name}`)
    this.filterData(name, null);
    this.setState({ activeTab: name });
  }

  render() {

    const { activeTab } = this.state;
    return (
      <div className="App" style={{ flex: 1 }} >
        <br></br>
        <Header as='h1' size='large' >Paul's ISP Speed Tracker</Header>
        <br></br>
        <br></br>
        <ISPBanner />
        <br></br>
        <br></br>
        <br></br>
        <Container>
          <Menu color={tabColors[activeTab]} inverted attached="top" tabular>
            <Menu.Item
              name="All"
              header={true}
              active={activeTab === 'All'}
              onClick={this.handleTabClick}
            />
            <Menu.Item
              name="EE"
              active={activeTab === 'EE'}
              onClick={this.handleTabClick}
            />
            <Menu.Item
              name="Vodafone"
              active={activeTab === 'Vodafone'}
              onClick={this.handleTabClick}
            />
            <Menu.Item
              name="Three"
              active={activeTab === 'Three'}
              onClick={this.handleTabClick}
            />
            <Menu.Item
              name="TalkTalk"
              active={activeTab === 'TalkTalk'}
              onClick={this.handleTabClick}
            />
            <Menu.Item
              name="VPN"
              active={activeTab === 'VPN'}
              onClick={this.handleTabClick}
            />
            <Menu.Item>
              <WhatIsThis parentColor={tabColors[activeTab]}/>
            </Menu.Item>

            <Menu.Item position='right'> Last Updated on : {this.state.lastTime}</Menu.Item>

          </Menu>

          <Segment attached='bottom'>
            <Container>
              <Plot parentColor={tabColors[activeTab]} upload={this.state.upload} download={this.state.download} />
            </Container>

          </Segment>

        </Container>
      </div>
    )
  }
}


export default App;