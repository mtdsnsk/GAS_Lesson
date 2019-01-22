var CHANNEL_ACCESS_TOKEN = PropertiesService.getScriptProperties().getProperty("CHANNEL_ACCESS_TOKEN"); 
var USER_ID = PropertiesService.getScriptProperties().getProperty("USER_ID");

function myFunction() {
  
  //シートの値を配列で取得
  var sh = SpreadsheetApp.getActiveSheet();
  var values = sh.getRange(2,1,4,2).getValues();
  var today = Moment.moment().format("YYYYMMDD");
  
  //今日の日付を偽装
  //today="20190101"
  
  //今日の日付を基に、ゴミ当番の人を決める
  for ( var i = 0; i < 4; i++ ){
    shDay = values[i][0];
    startDay = Moment.moment(shDay);
    
    for ( var j = 0; j < 7; j++ ){
      day = Moment.moment(startDay).add(j,"days");
      day = Moment.moment(day).format("YYYYMMDD");
      if (day == today) {
        targetUser = values[i][1]
      }
    }
  }
  
  garbageTypeCheck()
    
  var message　=　"明日は『" + garbageType + "』ゴミの日です。"+ String.fromCharCode(10) 
                + "ゴミ当番は『" + targetUser + "』さんです。";
  
  
  if (garbageType != "") {
    pushMessage(message);
  }
}


//曜日によって改修するゴミの種別を指定する関数
function garbageTypeCheck(){
  
  var dayOfWeek = new Date().getDay();
  var dayOfWeekStr = [ "日", "月", "火", "水", "木", "金", "土" ][dayOfWeek];
  
  //曜日を偽装する
  //dayOfWeek = 0

  if (dayOfWeekStr == "月"){
      garbageType = "可燃";
  }else if(dayOfWeekStr == "木"){
      garbageType = "可燃";
  }else if(dayOfWeekStr == "火"){
      garbageType = "資源";
  }else{
      garbageType = ""
  }
  return garbageType
}

function pushMessage(message) {
  var postData = {
    "to": USER_ID,
    "messages": [{
      "type": "text",
      "text": message,
    }]
  };

  var url = "https://api.line.me/v2/bot/message/push";
  var headers = {
    "Content-Type": "application/json",
    'Authorization': 'Bearer ' + CHANNEL_ACCESS_TOKEN,
  };

  var options = {
    "method": "post",
    "headers": headers,
    "payload": JSON.stringify(postData)
  };
  var response = UrlFetchApp.fetch(url, options);
}