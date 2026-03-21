// ============================================================
// Google Apps Script — BLOOM 予約 → Google カレンダー連携
// ============================================================
// 【セットアップ手順】
// 1. https://script.google.com で新しいプロジェクトを作成
// 2. このコードを貼り付ける
// 3. CALENDAR_ID を自分のGoogleカレンダーIDに変更する
//    （メインカレンダーなら 'primary'、専用カレンダーを作った場合はそのID）
// 4. 「デプロイ」→「新しいデプロイ」→ 種類: ウェブアプリ
//    - 実行するユーザー: 自分
//    - アクセス: 全員
// 5. 表示されたURLを index.html の GAS_URL に貼り付ける
// ============================================================

const CALENDAR_ID = 'primary'; // ← 自分のカレンダーIDに変更

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const { name, phone, email, date, time, menu, stylist, note } = data;

    // カレンダーにイベント作成
    const calendar = CalendarApp.getCalendarById(CALENDAR_ID);

    const startTime = new Date(`${date}T${time}:00`);
    const endTime = new Date(startTime.getTime() + 90 * 60 * 1000); // 90分枠

    const title = `【予約】${name} 様 - ${menu}`;
    const description = [
      `お名前: ${name}`,
      `電話番号: ${phone}`,
      `メール: ${email || '未記入'}`,
      `メニュー: ${menu}`,
      `担当: ${stylist}`,
      `備考: ${note || 'なし'}`,
    ].join('\n');

    calendar.createEvent(title, startTime, endTime, {
      description: description,
      location: '東京都渋谷区神宮前3-12-8 BLOOMビル 2F',
    });

    // 確認メール送信（メールアドレスがある場合）
    if (email) {
      MailApp.sendEmail({
        to: email,
        subject: '【Hair Salon BLOOM】ご予約リクエストを受け付けました',
        body: [
          `${name} 様`,
          '',
          'ご予約リクエストをいただきありがとうございます。',
          '以下の内容で承りました。',
          '',
          `日時: ${date} ${time}`,
          `メニュー: ${menu}`,
          `担当: ${stylist}`,
          '',
          '※ ご予約の確定はサロンからの返信をもって完了となります。',
          '※ 確認のご連絡まで少々お待ちください。',
          '',
          '━━━━━━━━━━━━━━━━━━',
          'Hair Salon BLOOM',
          'TEL: 03-5555-8720',
          '東京都渋谷区神宮前3-12-8 BLOOMビル 2F',
          '━━━━━━━━━━━━━━━━━━',
        ].join('\n'),
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
