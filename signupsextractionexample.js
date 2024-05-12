function liveUpdating(){
  var today = new Date()
  var numberOfDays = (24*60*60*1000) * 300 // 12 is the number of days
  var today = today.setTime(today.getTime()-numberOfDays)
  var startDate = Utilities.formatDate(new Date(today), "GMT+2", "dd/MM/yyyy");
  
  var sheetSignups = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("LIVE")
  var page_number = 1
  var allData = []
  do{
    var querySignups = `query{\n  people(\n    filters:{\n  \tsort:created_at\n   registered:{from:\"01/01/2023\"\n\t\t\t\n\t } \n }\n    page:${page_number}\n    per_page:1000\n  ){paging\n    {total_items\n  current_page\n      total_pages\n    }\n    data{\n created_at\n  dob\n      secure_identity_email\n      gender\n      academic_experiences{backgrounds{name}}\n      status\n      id\n      first_name\n      last_name\n      contact_detail\n      {\n        phone\n      }\n      lc_alignment{keywords}\n      home_lc{name}\n      home_mc{name}\n      person_profile{selected_programmes}\n  \treferral_type\n }\n \t }\n}`
    var query = JSON.stringify({query: querySignups})
    var data = dataExtraction(query)
    if(data.length != 0){
      allData.push(data.data)
      page_number++
    }
    //Logger.log(data.length)
  }while(data.paging.current_page <= data.paging.total_pages);

  var newRows = []
  var ids = sheetSignups.getRange(2,2,sheetSignups.getLastRow(),1).getValues()
  ids = ids.flat(1)
  for(let data of allData){
    
    for(let i = 0; i < data.length; i++){
     
      var index = ids.indexOf(parseInt(data[i].id))
      if(index==-1)
      {
         var backgrounds = []
        if(data[i].academic_experiences[0] !=null){
          if(data[i].academic_experiences[0].backgrounds[0] !=null)
            for(k of data[i].academic_experiences[0].backgrounds){
            backgrounds.push(k.name)
          }
        }
        newRows.push([
          data[i].created_at.substring(0,10),
          data[i].id,
          data[i].first_name + " "+ data[i].last_name,
          data[i].contact_detail ? data[i].contact_detail.phone : "-",
          data[i].secure_identity_email ? data[i].secure_identity_email : "-",
          data[i].gender ? data[i].gender : "-",
          data[i].dob ? data[i].dob : "-",
          data[i].status ? data[i].status : "-",
          data[i].person_profile ? changeProductCode(data[i].person_profile.selected_programmes):"-",
          data[i].home_lc.name,
          data[i].home_mc.name,
          backgrounds.join(","),
          data[i].lc_alignment ? data[i].lc_alignment.keywords:"-",
          data[i].referral_type,
          data[i].referral_type,
          data[i].lc_alignment ? data[i].lc_alignment.keywords:"-",
          backgrounds.join(","),
          
          ])
      }
      else{
        var backgrounds = []
        if(data[i].academic_experiences[0] !=null){
          if(data[i].academic_experiences[0].backgrounds[0] !=null)
            for(k of data[i].academic_experiences[0].backgrounds){
            backgrounds.push(k.name)
          }
        }
        var row = []
        row.push([
          data[i].created_at.substring(0,10),
          data[i].id,
          data[i].first_name + " "+ data[i].last_name,
          data[i].contact_detail ? data[i].contact_detail.phone : "-",
          data[i].secure_identity_email ? data[i].secure_identity_email : "-",
          data[i].gender ? data[i].gender : "-",
          data[i].dob ? data[i].dob : "-",
          data[i].status ? data[i].status : "-",
          data[i].person_profile ? changeProductCode(data[i].person_profile.selected_programmes):"-",
          data[i].home_lc.name,
          data[i].home_mc.name,
          backgrounds.join(","),
          data[i].lc_alignment ? data[i].lc_alignment.keywords:"-",
          data[i].referral_type
        ])
        
        sheetSignups.getRange(index+2,1,1,row[0].length).setValues(row)
      }
    }
    
  }
    if(newRows.length > 0){
    sheetSignups.getRange(sheetSignups.getLastRow()+1,1,newRows.length,newRows[0].length).setValues(newRows)
  }
}
