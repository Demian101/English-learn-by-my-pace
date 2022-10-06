const InfoShow = ( {status, res} ) => {

  const fortmatResponse = () => {
    return JSON.stringify(res, null, 2);
  };
  
  let result = res;
  if (status === 'success') {
    result = fortmatResponse({
      status: res?.status + "-" + res?.statusText,
      headers: res?.headers,
      data: res?.data,
    })
  }else if( status === 'error' || status === 'pending'){
    result = fortmatResponse(res)
  };

  return(
    <div>
      {result && (
        <div className="alert alert-secondary mt-2" role="alert">
          <pre>{result}</pre>
        </div>
      )}
    </div>
  )
}

export default InfoShow;