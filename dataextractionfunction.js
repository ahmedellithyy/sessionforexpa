function dataExtraction(graphql) //don't forget to pass the query from the other function
{
  
  var requestOptions = {
    'method': 'post',
    'payload': graphql,
    'contentType':'application/json',
    'headers':{
      'access_token': "ACCESS_TOKEN" //replace ACCESS_TOKEN with the token you have it
    }
  };
  var response = UrlFetchApp.fetch(`https://gis-api.aiesec.org/graphql?access_token=${access_token}`, requestOptions);
  var recievedDate = JSON.parse(response.getContentText());
  return recievedDate.data.allOpportunityApplication.data; //change here allOpportunityApplication based on the data you are requesting (people...etc.)
}
