export function getProviderCummulative(data) {
    const providers = ['EE', 'BT', 'TalkTalk', 'Three', 'Vodafone','Virgin']
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