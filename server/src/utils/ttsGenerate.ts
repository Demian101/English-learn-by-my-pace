import axios from 'axios';

export const ttsGenerate = async (text: string) => {
  console.log('ttsGenerate text', text)
  const res = await axios.get(`http://0.0.0.0:8000/text2voice/?text=${text}`).then((res) => {
    console.log('res.data', res.data)
    return res.data
  }).catch(function (error) {
    if (error.response) {
      // Request made and server responded
      console.log('error.response.data' ,error.response);
    } else if (error.request) {
      // The request was made but no response was received
      console.log('error.request', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  });
  if(res){
    return res
  }
}