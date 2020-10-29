import React, { Component } from 'react';
import { Container, Header, Menu, Segment, Statistic } from 'semantic-ui-react';
import Papa from 'papaparse';
import Plot from './Plot';
import './App.css';

const colors = {
  All: 'blue',
  EE: 'teal',
  Vodafone: 'red',
  Three: 'black',
  TalkTalk: 'grey',
  VPN: 'purple'
}

class App extends Component {

  state = { activeTab: 'All' , csvData: null};

  componentDidMount() {
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

  handleTabClick = (e, { name }) => this.setState({ activeTab: name })

  render() {
    const { activeTab } = this.state
    console.log(this.state.csvData)
    return (
      <div className="App">
        <br></br>
        <Header as='h1' size={"huge"}>What is my ISP doing?</Header>
        <br></br>
        <br></br>
        <Container>
            <Menu color={colors[activeTab]} inverted attached="top" tabular>
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
            <p>Active tab is {activeTab}</p>
            <Statistic.Group size='tiny'>
                <Statistic>
                  <Statistic.Value>10 mbps</Statistic.Value>
                  <Statistic.Label>24-Hour Average Speed</Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value>10 mbps</Statistic.Value>
                  <Statistic.Label>7-Day Average Speed</Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value>10 mbps</Statistic.Value>
                  <Statistic.Label>30-Day Average Speed</Statistic.Label>
                </Statistic>
            </Statistic.Group>
            <Container fluid>
              <Plot data={this.state.csvData}/>
            </Container>
            
          </Segment>

        </Container>
      </div>
    )
  }
}
  

export default App;
