export function getProviderCummulative(data) {
    let providerData = {}
    for (let i in data)
    {
        if (!(data[i].Provider in providerData))
        {
            providerData[data[i].Provider] = { Provider: data[i].Provider, Upload: 0, Download: 0, Count: 0}
        }
        providerData[data[i].Provider].Upload += data[i].Upload
        providerData[data[i].Provider].Download += data[i].Download
        providerData[data[i].Provider].Count += 1
    }
    let _data = []
    let ignore = ['WorldStream', 'Total', 'Performive', null]
    for (const key in providerData)
    {
        if (ignore.includes(providerData[key].Provider)) 
        {
            continue;    
        }
        providerData[key].Upload /= providerData[key].Count;
        providerData[key].Upload = providerData[key].Upload.toFixed(2)
        providerData[key].Download /= providerData[key].Count;
        providerData[key].Download = providerData[key].Download.toFixed(2)
        _data.push(providerData[key])
    }
    return _data
}

export function dataRecents(data) {
    const now = new Date()
    let newData = [...data.slice(-5, -1)]
    newData.reverse()
    for (let i in newData)
    {
        let timeLapsed = now.getTime() - new Date(newData[i].RecordTime).getTime()
        timeLapsed /= (1000 * 60 * 60)
        if (timeLapsed <= 1.5)
        {
            timeLapsed = 'Less than 1 hour ago'
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
        delete newData[i].RecordTime;
        delete newData[i].Provider;
        delete newData[i].Download;
        delete newData[i].Upload;
    }
    return newData;
}

function compare(a, b) {
  let comparison = 0;
  if (a.Count > b.Count) {
    comparison = 1;
  } else if (a.Count < b.Count) {
    comparison = -1;
  }
  return comparison;
}

export function getHostData(data) {
    let hostData = {}
    // console.log(data)
    for (let i in data)
    {
        let key = data[i].Host
        if (null in data[i] || key === null)
        {
            continue;    
        }
        let idx = key.indexOf('[')
        key = key.slice(0, idx)
        // console.log(key)
        if (!(key in hostData))
        {
            hostData[key] = {Host: key, Count: 0}
        }
        hostData[key].Count += 1
    }

    let _data = []

    for (const key in hostData)
    {
        _data.push(hostData[key]) 
    }
    // console.log(_data)
    _data.sort(compare)
    let n = _data.length
    return _data.slice(n - 4, n);
}

export function propAverage(data, prop, yest) {
    const today = new Date()
    let avg = 0;
    for (let i = 0; i < data.length; i++) {
        if (yest) {
            let refDate = new Date(data[i].RecordTime);
            if (refDate.getDate() === today.getDate() && refDate.getMonth() === today.getMonth() && refDate.getFullYear() === today.getFullYear()) {
                continue;
             }
        }
        avg += data[i][prop]
    }
    avg = avg / data.length;
    return avg.toFixed(1);
}

export function countToday(data, yest) {
    let count = 0;
    const today = new Date();
    if (yest) {
        today.setDate(today.getDate() - 1);
    }
   

    for (let i = data.length - 1; i >= 0; i--){
        let refDate = new Date(data[i].RecordTime)
        if (refDate.getDate() === today.getDate() && refDate.getMonth() === today.getMonth() && refDate.getFullYear() === today.getFullYear()) {
            count++
        }
    }
    
    return count;
}

export function normalise(data, type) {
    if (data === undefined)
    {
        return null
    }
    let _data = []
    for (let i = 0; i < data.length; i++)
    {
        let refDate = new Date(data[i].RecordTime)
        let year = refDate.getFullYear()
        let month = refDate.getMonth()
        let day = refDate.getDate()
        let hour = refDate.getHours()
        let key = `${year}${month}${day}${hour}`
        if (!(key in _data))
        {
            _data[key] = []
        }
        _data[key].push(data[i])
    }

    let newData = []
    for (const key in _data)
    {
        const dataObject = { Download: 0, Upload: 0, Provider: null, RecordTime: null }
        dataObject.RecordTime = _data[key][0].RecordTime;
        dataObject.Provider = _data[key][0].Provider;
        for (let value in _data[key])
        {
            dataObject.Download += _data[key][value].Download;
            dataObject.Upload += _data[key][value].Upload;
        }
        dataObject.Download /= _data[key].length;
        dataObject.Upload /= _data[key].length;
        dataObject.Download = dataObject.Download.toFixed(1)
        dataObject.Upload = dataObject.Upload.toFixed(1)
        newData.push(dataObject)
    }
    // console.log(newData)
    return newData;
}