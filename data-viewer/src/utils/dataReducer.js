function yesterdayData(data)
{
    let yestData = [];
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1);
    for (let i = 0; i < data.length; i++)
    {
        let refDate = new Date(data[i].RecordTime);
        if (refDate.getDate() === yesterday.getDate() && refDate.getMonth() === yesterday.getMonth() && refDate.getFullYear() === yesterday.getFullYear())
        {
            yestData.push(data[i])
        }
    }
    return yestData;
}

export function applyfilters(summary, data, minimumDownload, minimumUpload, moreData)
{
    let yestData = data;
    if (moreData !== null)
    {
        yestData = yesterdayData(moreData)
    }
    let avgDownloadToday = propAverage(data, 'Download', false);
    let avgDownloadYesterday = propAverage(yestData, 'Download', true);
    let pctChangeDownload = (avgDownloadToday - avgDownloadYesterday) / avgDownloadYesterday * 100;
    let avgUploadToday = propAverage(data, 'Upload', false);
    let avgUploadYesterday = propAverage(yestData, 'Upload', true);
    let pctChangeUpload = avgUploadYesterday ? (avgUploadToday - avgUploadYesterday) / avgUploadYesterday * 100 : 0;
    let testsToday = countToday(data, false);
    // let testsYesterday = countToday(yestData, true);
    // let pctChangeTests = testsYesterday ? (testsToday - testsYesterday) / testsYesterday * 100 : 0;
    let pctChangeTotal = data.length ? (data.length - testsToday) / data.length : 0;
    summary[0].description = avgDownloadToday + ' Mbps';
    summary[0].meta = 'Change Since Yesterday: ' + pctChangeDownload.toFixed(1) + ' %';
    summary[1].description = avgUploadToday + ' Mbps';
    summary[1].meta = 'Change Since Yesterday: ' + pctChangeUpload.toFixed(1) + ' %';
    // summary[2].description = testsToday;
    // summary[2].meta = 'Change Since Yesterday: ' + pctChangeTests.toFixed(1) + ' %';
    summary[2].description = data.length;
    summary[2].meta = 'Change Since Yesterday: ' + pctChangeTotal.toFixed(1) + ' %';
    let count = 0
    for (let i in data)
    {
        if (data[i].Download >= minimumDownload && data[i].Upload >= minimumUpload)
        {
            count++;
        }
    }
    let threshold = count / data.length * 100
    threshold = threshold.toFixed(0)
    summary[3].description = `${threshold}%`
    if (threshold >= 90)
    {
        summary[3].meta = 'Excellent Service!'    
    }
    else if (threshold >= 80)
    {
        summary[3].meta = 'Good Service'    
    }
    else if (threshold >= 50)
    {
        summary[3].meta = 'So So Service'    
    }
    else if (threshold >= 30)
    {
        summary[3].meta = 'Bad Service'    
    }
    else 
    {
        summary[3].meta = 'What the hell?'
    }
    return summary
}

const providers = ['EE', 'BT', 'TalkTalk', 'Three', 'Vodafone']

export function getProviderCummulative(data) {
    let providerData = {}
    for (let i in data)
    {
        let provider = data[i].Provider
        if (provider === null)
        {
            console.log('null provider')
            console.log(data[i])
            continue;    
        }
        if (!(provider in providerData))
        {
            if (!providers.includes(data[i].Provider))
            {
                provider = 'VPN'
            }
            providerData[provider] = { Provider: provider, Upload: 0, Download: 0, Count: 0}
        }
        providerData[provider].Upload += data[i].Upload
        providerData[provider].Download += data[i].Download
        providerData[provider].Count += 1
    }
    let _data = []
    
    for (const key in providerData)
    {
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
    for (let i in data)
    {
        let key = data[i].Host
        if (null in data[i] || key === null)
        {
            continue;    
        }
        let idx = key.indexOf('[')
        key = key.slice(0, idx)
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
    _data.sort(compare)
    let n = _data.length
    return _data.slice(n - 4, n);
}

export function propAverage(data, prop, yest) {
    const today = new Date()
    let avg = 0;
    let N = data.length;
    for (let i = 0; i < data.length; i++) {
        if (yest) {
            let refDate = new Date(data[i].RecordTime);
            if (refDate.getDate() === today.getDate() && refDate.getMonth() === today.getMonth() && refDate.getFullYear() === today.getFullYear()) {
                N--;
                continue;
             }
        }
        avg += data[i][prop]
    }
    avg = avg / N;
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

export function filterTime(data, timeDuration)
{
    let new_data = []
    const today = new Date();
    for (let i in data)
    {
        let refDate = new Date(data[i].RecordTime)
        if (timeDuration === '30 days')
        {
            let diff = (today.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24)
            if (diff <= 30)
            {
                new_data.push(data[i])    
            }
        }
        else if (timeDuration === '7 days')
        {
            let diff = (today.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24)
            if (diff <= 7)
            {
                new_data.push(data[i])    
            }
        }
        else if (timeDuration === '24 hours')
        {
            let diff = (today.getTime() - refDate.getTime()) / (1000 * 60 * 60)
            if (diff <= 24)
            {
                new_data.push(data[i])
                
            }
        }
    }
    return new_data
}

export function normaliseAllData(data) {
    if (data === undefined)
    {
        return null
    }
    let _data = []
    for (let i = 0; i < data.length; i++)
    {
        let refDate = new Date(data[i].RecordTime)
        let year = refDate.getFullYear()
        let month = refDate.getMonth() + 1
        
        if (isNaN(year) || isNaN(month))
        {
            continue;    
        }

        let key = `${year}${month}`
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
    newData.sort(compare2)
    return newData;
}

function compare2(a, b) {
  let comparison = 0;
  if (a.RecordTime > b.RecordTime) {
    comparison = 1;
  } else if (a.RecordTime < b.RecordTime) {
    comparison = -1;
  }
  return comparison;
}