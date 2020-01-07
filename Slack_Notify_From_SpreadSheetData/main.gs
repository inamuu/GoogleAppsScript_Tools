
function mainFunction() {
  var mySheet = SpreadsheetApp.getActiveSheet();
  var searchKey = "検索文字列";
  var reqList = mySheet.getRange('B6:B100').getValues();

  var reqCount = 0
  for (var i = 0; i < reqList.length; i++){
    if (reqList[i] == searchKey){
        reqCount ++
    }
  }

  var msgTxt = "通知くん"

  switch(true){
    case reqCount >= 2.0:
      var msgTitle = "依頼ステータスの「依頼予定」は1つだけにしてください。";
      msgSelect = Browser.msgBox(msgTxt,msgTitle,Browser.Buttons.OK);
      break
    case reqCount == 1.0:
      var msgTitle = "依頼を通知してもよろしいですか？";
      var msgSelect = Browser.msgBox(msgTxt,msgTitle,Browser.Buttons.OK_CANCEL);
      if ( msgSelect == "ok" ) {
        checkReqData();
        var msgEnd = "レビュー依頼の通知が完了しました。"
        Browser.msgBox(msgTxt,msgEnd,Browser.Buttons.OK);
      } else {
        var msgCancel = "レビュー依頼は実行されませんでした。" 
        Browser.msgBox(msgTxt,msgCancel,Browser.Buttons.OK);
      }
      break
    default:
      var msgTitle = "依頼予定の案件はありませんでした。\\n依頼したい場合は依頼ステータスを「依頼予定」へ変更してください。";
      msgSelect = Browser.msgBox(msgTxt,msgTitle,Browser.Buttons.OK);
      break
  }
}

function notifySlack(actRng, cel_A, cel_B,cel_C) {
  var slack_token = 'xoxp-XXXXX'
  var slack_team = 'XXXXX'
  var icon_emoji = ":+1:"
  var toUser = '<@テスト太郎>'
  var notifyChannel = '#チャンネル名'

  var payload = {
   "token" : slack_token,
   "text" : "\n" +
toUser + "さん こちらが依頼内容になります。" +"\n" +
"```" + "\n" +
"管理No：" + cel_A + "\n" +
"申請日：" + cel_B + "\n" +
"申請者：" + cel_C + "\n" +
"```",
   "channel" : notifyChannel,
 }

 var options = {
   "method" : "POST",
   "payload" : payload
 }
 Logger.log(payload)

  UrlFetchApp.fetch("https://slack.com/api/chat.postMessage", options);
  
  actRng.setValue("依頼済み");
  return
}

function checkReqData() {
  var mySheet = SpreadsheetApp.getActiveSheet();
  var searchKey = "検索文字列";
  var textFinder = mySheet.createTextFinder(searchKey);
  var allCel = textFinder.findAll();
  var resCel = allCel[0].getA1Notation();
  var actRng = mySheet.getRange(resCel);
  
  var cel_A = actRng.offset(0, -1).getValue();
  var cel_C = actRng.offset(0,  2).getValue();
  
  var cel_B_date = actRng.offset(0,  1).getValue();
  var cel_B = Utilities.formatDate(cel_B_date,'JST','yyyy/MM/dd');

  notifySlack(actRng, cel_A, cel_B, cel_C);
  return
}

