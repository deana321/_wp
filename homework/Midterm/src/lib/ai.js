function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const summaries = [
  "這是一篇關於校園生活的精彩分享，同學們熱烈討論中 🎀",
  "作者分享了在學校的有趣經歷，讓人會心一笑 💕",
  "這篇文章探討了學習方法與心得，值得收藏 📖",
  "充滿正能量的貼文！大家一起來交流吧 ✨",
  "實用資訊分享！幫大家節省了不少時間 🎯",
  "溫馨的校園故事，展現了同學間的情誼 🌸",
  "關於選課與修課的經驗談，新生必看 💡",
  "有趣的社團活動分享，校園生活真豐富 🎉"
];

const productDescs = [
  "這是一款深受校園同學喜愛的商品，粉色系包裝可愛又實用，適合日常攜帶使用。",
  "採用高品質材質製作，搭配馬卡龍色系設計，是送禮自用兩相宜的好選擇。",
  "校園必備單品！輕巧方便，多種顏色可選，讓你的校園生活更繽紛。",
  "網友激推！超高CP值，耐用又美觀，回購率超高的人氣商品。",
  "限時優惠中！質感與實用兼具，錯過就不再有的甜甜價。"
];

const replyDrafts = [
  "親愛的同學你好：\n\n感謝你的來信！關於你提到的問題，我已經了解了。我會盡快處理並回覆你。\n\n祝 學業順利\n\n🍬",
  "嗨～\n\n收到你的信件了！謝謝你分享這些資訊，我覺得很有幫助。\n\n有任何問題我們可以再討論喔！\n\n🌸",
  "親愛的朋友：\n\n謝謝你的來信。關於你詢問的事項，我建議我們可以約個時間當面討論，會比較清楚。\n\n期待你的回覆\n\n💕",
  "Hello~\n\n你的信件我收到了！這幾件事我確認後再跟你說。\n\n先祝你一切順利！\n\n✨"
];

export function aiSummarize(text) {
  return randomFrom(summaries);
}

export function aiProductDescription(name) {
  return randomFrom(productDescs);
}

export function aiReplyDraft(emailContent) {
  return randomFrom(replyDrafts);
}
