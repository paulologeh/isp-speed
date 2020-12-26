import React, { Component } from 'react';
import { Container, Modal, Button, Header, Menu, Segment, Image, Grid, Icon } from 'semantic-ui-react';
import Papa from 'papaparse';
import Plot from './Plot';
import './App.css';

function isMobile() {
  let check = false;
  (function (a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw(n|u)|c55\/|capi|ccwa|cdm|cell|chtm|cldc|cmd|co(mp|nd)|craw|da(it|ll|ng)|dbte|dcs|devi|dica|dmob|do(c|p)o|ds(12|d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(|_)|g1 u|g560|gene|gf5|gmo|go(\.w|od)|gr(ad|un)|haie|hcit|hd(m|p|t)|hei|hi(pt|ta)|hp( i|ip)|hsc|ht(c(| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i(20|go|ma)|i230|iac( ||\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|[a-w])|libw|lynx|m1w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|mcr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|([1-8]|c))|phil|pire|pl(ay|uc)|pn2|po(ck|rt|se)|prox|psio|ptg|qaa|qc(07|12|21|32|60|[2-7]|i)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h|oo|p)|sdk\/|se(c(|0|1)|47|mc|nd|ri)|sgh|shar|sie(|m)|sk0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h|v|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl|tdg|tel(i|m)|tim|tmo|to(pl|sh)|ts(70|m|m3|m5)|tx9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas|your|zeto|zte/i.test(a.substr(0, 4)))
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}

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

const menuStyle = { flexGrow: 1, width: '75%', height: '80%' };
const bannerStyle = { flexGrow: 1, width: '75%'}

const ISPBanner = () => {
  return (
    <Container>
      <Grid columns={4}>
        <Grid.Row centered>
          <Grid.Column>
            <Image src={process.env.PUBLIC_URL + '/EE.jpg'} size='tiny' />
          </Grid.Column>
          <Grid.Column>
            <Image src={process.env.PUBLIC_URL + '/Three.png'} size='tiny' />
          </Grid.Column>
          <Grid.Column>
            <Image src={process.env.PUBLIC_URL + '/Vodafone.png'} size='tiny' />
          </Grid.Column>
          <Grid.Column>
            <Image src={process.env.PUBLIC_URL + '/TalkTalk.jpg'} size='tiny' />
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
      trigger={<Button>Click For More Info</Button>}
    >
      <Modal.Header>What Is This?</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          This tool tracks the speed of my internet service provider.
          It runs an internet speed test every hour and stores this data.
          I have had multiple ISPs and wanted to compare their performance and figure out who the best is.
          I have used Three, EE, Vodafone and TalkTalk at different times. I have even had one or two at the same time and would
          switch between them daily. The VPN tab is for when I am using a VPN so the speed test will not recognise the ISP.
          You switch between tabs to see data for each respective ISP. You can also filter by time frame.
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
    print(this.state.csvData)
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
    const response = await fetch(process.env.PUBLIC_URL + '/speed_data.csv');
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
    }
    this.setState({ download: downloads, upload: uploads });
  }

  handleTabClick = (e, { name }) => {
    print(`clicked ${name}`)
    this.filterData(name, null);
    this.setState({ activeTab: name });
  }

  renderDesktopMenu(){
    const { activeTab } = this.state;
    return(
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
        <Menu.Item style={{ width: '300px'}}> Last Updated on : {this.state.lastTime}</Menu.Item>
    </Menu>
    )
  }

  renderMobileMenu(){
    const { activeTab } = this.state;
    return(
      <Menu color={tabColors[activeTab]} inverted attached="top" fluid vertical>
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
      <Menu.Item style={{ width: '300px'}}> Last Updated on : {this.state.lastTime}</Menu.Item>
      </Menu>
    )
  }

  render() {
    const { activeTab } = this.state;
    return (
      <div className="App">
        <br></br>
        <Header as='h1' size='large' >Paul's ISP Speed Tracker</Header>
        <br></br>
        <br></br>
        <ISPBanner style={bannerStyle}/>
        <br></br>
        <br></br>
        <br></br>
        <Container style={menuStyle}>
          {isMobile() ? this.renderMobileMenu(): this.renderDesktopMenu()}
          <Segment compact attached='bottom'>
              <Plot parentColor={tabColors[activeTab]} upload={this.state.upload} download={this.state.download} />
          </Segment>

        <WhatIsThis parentColor={tabColors[activeTab]}/>

        </Container>
      </div>
    )
  }
}

export default App;