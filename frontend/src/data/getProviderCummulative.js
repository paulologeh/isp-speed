export function getProviderCummulative(data) {
  const providers = ["EE", "BT", "TalkTalk", "Three", "Vodafone", "Virgin"];
  let providerData = {};
  for (let i in data) {
    let provider = data[i].provider;
    if (provider === null) {
      console.log("null provider");
      console.log(data[i]);
      continue;
    }
    if (!(provider in providerData)) {
      if (!providers.includes(data[i].provider)) {
        provider = "VPN";
      }
      providerData[provider] = {
        provider: provider,
        upload: 0,
        download: 0,
        Count: 0,
      };
    }
    providerData[provider].upload += data[i].upload;
    providerData[provider].download += data[i].download;
    providerData[provider].Count += 1;
  }
  let _data = [];

  for (const key in providerData) {
    providerData[key].upload /= providerData[key].Count;
    providerData[key].upload = providerData[key].upload.toFixed(2);
    providerData[key].download /= providerData[key].Count;
    providerData[key].download = providerData[key].download.toFixed(2);
    _data.push(providerData[key]);
  }
  return _data;
}
