import React from 'react'
import { Feed } from 'semantic-ui-react'
import {ResponsiveContainer} from 'recharts';


const ActivityFeed = (props) =>
{
    return (
        <ResponsiveContainer centered width={"100%"} height={300}>
            <Feed events={props.data} />
        </ResponsiveContainer>
        
    )
}
   
export default ActivityFeed