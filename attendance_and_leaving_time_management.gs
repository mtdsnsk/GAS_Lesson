channel_access_token = PropertiesService.getScriptProperties().getProperty("channel_access_token");

function doPost(e) {
  var events = JSON.parse(e.postData.contents).events;
  events.forEach(function(event) {
    if(event.type == "message") {
      record(event);
    }
 });
}

function record(e) {
  var sh = SpreadsheetApp.getActiveSheet();
  var lastRow = sh.getLastRow();
  
  if(e.message.text == "出勤"){
    var columnAVals = sh.getRange('A:A').getValues();
    var lastRow = columnAVals.filter(String).length;
    sh.getRange(lastRow + 1, 1).setValue(Utilities.formatDate( new Date(), 'Asia/Tokyo', 'HH:mm'));
  }else if(e.message.text == "退勤"){
    var columnAVals = sh.getRange('B:B').getValues();
    var lastRow = columnAVals.filter(String).length;
    sh.getRange(lastRow + 1, 2).setValue(Utilities.formatDate( new Date(), 'Asia/Tokyo', 'HH:mm'));
  }
    
  var message = {
    "replyToken" : e.replyToken,
    "messages" : [
      {
        "type" : "text",
        "text" : ((e.message.type=="text") ? e.message.text + "時刻を記録しました。": "出勤・退勤というワード以外は受け付けておりません。")
      }
    ]
  };
  var replyData = {
    "method" : "post",
    "headers" : {
      "Content-Type" : "application/json",
      "Authorization" : "Bearer " + channel_access_token
    },
    "payload" : JSON.stringify(message)
  };
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", replyData);
}