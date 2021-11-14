import { Menu, Sidebar, Image, Icon, Header, Form, Checkbox, Modal} from 'semantic-ui-react'
import { Mobile } from '../utils/index'

const durations = ['24 hours', '7 days', '30 days', 'All Time']

const BarMenu = ({
  sidebar,
  handleSidebar,
  customise,
  handleModal,
  currentDuration,
  handleDuration,
  minDownload,
  minUpload,
  handleDownload,
  handleUpload
}) => {
  
  return (
          <Sidebar
            as={Menu}
            animation='push'
            icon='labeled'
            inverted
            vertical={Mobile() ? false : true}
            visible={sidebar}
            onHide={() => handleSidebar(false)}
            width='thin'
            direction={Mobile() ? 'top' : 'left'}
            style={{maxHeight: Mobile() ? '100px' : null}}
          >
            {Mobile() ? null :
              <Menu.Item as='image'>
                <Image size={'small'} circular src={process.env.PUBLIC_URL + '/profile.jpg'} />
                <br />
                <Menu.Header>Welcome Paul!</Menu.Header>
              </Menu.Item>
            }
              <Menu.Item as='a' onClick={() => { window.location = '/';}}><Icon name='home' />Home</Menu.Item>
            <Modal
              closeIcon
              open={customise}
              trigger={<Menu.Item as='a'><Icon name='edit outline' />Customize</Menu.Item>}
              onClose={() => handleModal(false)}
              onOpen={() => handleModal(true)}
            >
              <Header icon='edit' content='Customise Data' />
                <Modal.Content>
                  <Form>
                    <Form.Group>
                    <Header>Duration Filters</Header>
                    {durations.map((duration, i) =>
                      <Form.Field key={i}>
                        <Checkbox
                          radio
                          label={duration}
                          name='checkboxRadioGroup'
                          duration={duration}
                          checked={currentDuration === duration}
                          onChange={(event, data) => handleDuration(event, data)}
                        />
                      </Form.Field>)}
                    </Form.Group> 
                    <Form.Group>
                      <Header>Speed Thresholds</Header>
                      <Form.Input key='in1' label='Minimum Download' type='number' value={minDownload} onChange={(event)=> handleDownload(event)} />
                      <Form.Input key='in2' label='Minimum Upload'type='number'value={minUpload} onChange={(event)=> handleUpload(event)}/>
                    </Form.Group>
                  </Form>
                </Modal.Content>
            </Modal>
            <Menu.Item as='a' href='https://github.com/paulologeh/ISP-Speed/blob/master/README.md'><Icon name='info' />About</Menu.Item>
            <Menu.Item as='a' href='https://github.com/paulologeh/ISP-Speed'><Icon name='github' />Source Code</Menu.Item>
          </Sidebar>
  )
}

export default BarMenu;