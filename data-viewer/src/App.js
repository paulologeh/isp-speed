import React, { Component } from 'react';
import { Container, Header, Menu, Segment, Image, Grid } from 'semantic-ui-react';
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


class App extends Component {

  state = { activeTab: 'All', csvData: null, upload: null, download: null };

  componentDidMount() {
    console.clear()
    this.GetData();
  }

  async GetData() {
    const data = Papa.parse(await this.fetchCsv());
    this.setState({ csvData: data })
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

  filterISPData = (name) => {
    let upload = [];
    let download = [];
    let downloadSpeed = 0;
    let uploadSpeed = 0;
    let N = this.state.csvData.data.length - 1;
    let count = 0;
    for (let i = N; i > 0; i--) {
      if (name === 'All') {
        let datapoint = this.state.csvData.data[i];
        datapoint[2] = (isNaN(datapoint[2]) || datapoint[2] === '') ? 0 : datapoint[2];
        datapoint[3] = (isNaN(datapoint[3]) || datapoint[3] === '') ? 0 : datapoint[3];
        downloadSpeed += parseFloat(datapoint[2]);
        uploadSpeed += parseFloat(datapoint[3]);
        let time = datapoint[0] + " " + datapoint[1];
        if (i % 3 === 0 && i !== 0) {
          downloadSpeed = downloadSpeed / 3;
          uploadSpeed = uploadSpeed / 3;
          download.unshift({ x: time, y: downloadSpeed });
          upload.unshift({ x: time, y: uploadSpeed });
          downloadSpeed = 0;
          uploadSpeed = 0;
        }
        count++;
      }
      if (count > 24 * 3) {
        break;
      }
    }
    return [download, upload];
  }

  handleTabClick = (e, { name }) => {
    this.setState({ activeTab: name });
    let data = this.filterISPData(name);
    this.setState({ download: data[0], upload: data[1] });
  }

  render() {
    const { activeTab } = this.state;

    return (
      <div className="App" style={{ flex: 1 }} >
        <br></br>
        <Header as='h1' size={"huge"}>What is Paul's ISP doing?</Header>
        <br></br>
        <ISPBanner />
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

          </Menu>

          <Segment attached='bottom'>
            <Container>
              <Plot upload={this.state.upload} download={this.state.download} />
            </Container>

          </Segment>

        </Container>
      </div>
    )
  }
}


export default App;