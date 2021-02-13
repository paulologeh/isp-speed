import React from 'react'
import { Feed } from 'semantic-ui-react'
import { ResponsiveContainer } from 'recharts';
import { isMobile } from '../utils/helpers';


const ActivityFeed = (props) =>
{
    return (
        <ResponsiveContainer centered width={"100%"} minHeight={300}>
            <Feed events={props.data} size={isMobile() ? 'small' : null}/>
        </ResponsiveContainer>
        
    )
}
   
export default ActivityFeed