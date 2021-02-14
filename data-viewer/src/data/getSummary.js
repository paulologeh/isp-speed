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

function propAverage(data, prop, yest) {
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

function countToday(data, yest) {
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

export function getSummary(summary, data, minimumDownload, minimumUpload, moreData)
{
    let yestData = JSON.parse(JSON.stringify(data));
    if (moreData !== null)
    {
        yestData = JSON.parse(JSON.stringify(yesterdayData(moreData)))
    }
    let avgDownloadToday = propAverage(data, 'Download', false);
    let avgDownloadYesterday = propAverage(yestData, 'Download', true);
    let pctChangeDownload = (avgDownloadToday - avgDownloadYesterday) / avgDownloadYesterday * 100;
    // console.log(avgDownloadToday, avgDownloadYesterday)
    console.log(data)
    let avgUploadToday = propAverage(data, 'Upload', false);
    let avgUploadYesterday = propAverage(yestData, 'Upload', true);
    let pctChangeUpload = avgUploadYesterday ? (avgUploadToday - avgUploadYesterday) / avgUploadYesterday * 100 : 0;
    let testsToday = countToday(data, false);
    summary[0].description = avgDownloadToday + ' Mbps';
    summary[0].meta = 'Change Since Yesterday: ' + pctChangeDownload.toFixed(1) + ' %';
    summary[1].description = avgUploadToday + ' Mbps';
    summary[1].meta = 'Change Since Yesterday: ' + pctChangeUpload.toFixed(1) + ' %';
    summary[2].description = data.length;
    summary[2].meta = 'Tests Today: ' + testsToday;
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
        summary[3].meta = 'Average Service'    
    }
    else if (threshold >= 30)
    {
        summary[3].meta = 'Poor Service'    
    }
    else 
    {
        summary[3].meta = 'Unusable'
    }
    console.log(summary)
    return summary
}