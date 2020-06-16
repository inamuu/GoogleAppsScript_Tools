function createFolder(Id) {
  var Today = Utilities.formatDate(new Date(), "JST", "YYYYMMdd");
  DestFd = DriveApp.getFolderById(Id).createFolder(Today);
  return;
}

function getAttachements() {
  var SeikyuFolderId = 'XXXXX';
  createFolder(SeikyuFolderId);
  
  var strTerms = '請求書 has:attachment';
  var myThreads = GmailApp.search(strTerms, 0, 30);
  var myMessages = GmailApp.getMessagesForThreads(myThreads); //スレッドからメールを取得する　→二次元配列で格納
 
  for(var i=0;i < myMessages.length;i++){
    Logger.log(myMessages[i][0].getSubject());  //各スレッドの1番目のメールの表題をログ出力
  }
}

