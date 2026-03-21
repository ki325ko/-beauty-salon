const CALENDAR_ID = 'primary';

function doPost(e) {
  try {
    var name = e.parameter.name;
    var phone = e.parameter.phone;
    var email = e.parameter.email;
    var date = e.parameter.date;
    var time = e.parameter.time;
    var menu = e.parameter.menu;
    var stylist = e.parameter.stylist;
    var note = e.parameter.note;

    var calendar = CalendarApp.getCalendarById(CALENDAR_ID);

    var startTime = new Date(date + 'T' + time + ':00');
    var endTime = new Date(startTime.getTime() + 90 * 60 * 1000);

    var title = '【予約】' + name + ' 様 - ' + menu;
    var description = 'お名前: ' + name + '\n'
      + '電話番号: ' + phone + '\n'
      + 'メール: ' + (email || '未記入') + '\n'
      + 'メニュー: ' + menu + '\n'
      + '担当: ' + stylist + '\n'
      + '備考: ' + (note || 'なし');

    calendar.createEvent(title, startTime, endTime, {
      description: description,
      location: '東京都渋谷区神宮前3-12-8 BLOOMビル 2F'
    });

    if (email) {
      MailApp.sendEmail({
        to: email,
        subject: '【Hair Salon BLOOM】ご予約リクエストを受け付けました',
        body: name + ' 様\n\n'
          + 'ご予約リクエストをいただきありがとうございます。\n'
          + '以下の内容で承りました。\n\n'
          + '日時: ' + date + ' ' + time + '\n'
          + 'メニュー: ' + menu + '\n'
          + '担当: ' + stylist + '\n\n'
          + '※ ご予約の確定はサロンからの返信をもって完了となります。\n'
          + '※ 確認のご連絡まで少々お待ちください。\n\n'
          + '━━━━━━━━━━━━━━━━━━\n'
          + 'Hair Salon BLOOM\n'
          + 'TEL: 03-5555-8720\n'
          + '東京都渋谷区神宮前3-12-8 BLOOMビル 2F\n'
          + '━━━━━━━━━━━━━━━━━━'
      });
    }

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'ok' })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
