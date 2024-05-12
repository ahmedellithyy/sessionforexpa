function dataExtraction(graphql)
{
  
  var requestOptions = {
    'method': 'post',
    'payload': graphql,
    'contentType':'application/json',
    'headers':{
      'access_token': "ACCESS_TOKEN"
    }
  };
  var response = UrlFetchApp.fetch(`https://gis-api.aiesec.org/graphql?access_token=${access_token}`, requestOptions);
  var recievedDate = JSON.parse(response.getContentText());
  return recievedDate.data.allOpportunityApplication.data;
}
