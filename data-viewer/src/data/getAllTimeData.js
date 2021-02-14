function compare(a, b) {
  let comparison = 0;
  if (a.RecordTime > b.RecordTime) {
    comparison = 1;
  } else if (a.RecordTime < b.RecordTime) {
    comparison = -1;
  }
  return comparison;
}

export function getAllTimeData(data) {
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
    newData.sort(compare)
    return newData;
}