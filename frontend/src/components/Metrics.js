import React from 'react'
import {Card} from 'semantic-ui-react'

const Metrics = ({summary}) => {
    return (
         <Card.Group centered items={summary}/>
    )
}

export default Metrics;