import React from 'react'
import { Feed } from 'semantic-ui-react'
import { ResponsiveContainer } from 'recharts';
import { Mobile } from '../utils/index';


const ActivityFeed = (props) =>
{
    return (
        <ResponsiveContainer centered width={"100%"} minHeight={300}>
            <Feed events={props.data} size={Mobile() ? 'small' : null}/>
        </ResponsiveContainer>
        
    )
}
   
export default ActivityFeed