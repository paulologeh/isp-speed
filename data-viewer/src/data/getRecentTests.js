export function getRecentTests(data) {
    const now = new Date()
    let newData = JSON.parse(JSON.stringify(data.slice(Math.max(data.length - 4, 0))))
    newData.reverse()
    for (let i in newData)
    {
        let timeLapsed = now.getTime() - new Date(newData[i].RecordTime).getTime()
        timeLapsed /= (1000 * 60 * 60)
        if (timeLapsed <= 1)
        {
            timeLapsed = 'Less than 1 hour ago'
        }
        else if (timeLapsed <= 1.5)
        {
            timeLapsed = 'About 1 hour ago'
        }
        else if (timeLapsed > 24)
        {
            timeLapsed = 'More than a day ago'
        }
        else {
            timeLapsed = `About ${timeLapsed.toFixed(0)} hours ago`
        }
        
        newData[i].date = timeLapsed
        newData[i].meta = newData[i].Host;
        newData[i].summary = `Download: ${newData[i].Download} Mbps   Upload: ${newData[i].Upload} Mbps`
        if (newData[i].Provider === 'EE')
        {
            newData[i].image = process.env.PUBLIC_URL + '/EE.jpg';    
        }
        else if (newData[i].Provider === 'Three')
        {
            newData[i].image = process.env.PUBLIC_URL + '/Three.png';    
        }
        else if (newData[i].Provider === 'Virgin')
        {
            newData[i].image = process.env.PUBLIC_URL + '/virginfibre.png';    
        }
        else
        {
            newData[i].image = process.env.PUBLIC_URL + '/vpn.png';
        }
        delete newData[i].RecordTime;
        delete newData[i].Provider;
        delete newData[i].Download;
        delete newData[i].Upload;
    }
    return newData;
}