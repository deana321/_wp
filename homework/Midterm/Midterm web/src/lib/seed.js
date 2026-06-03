import { readDB, writeDB } from './db.js';

export function seedIfEmpty() {
  const db = readDB();
  if (db.users && db.users.length > 0) return;

  const seedData = {
    currentUser: 'user1',
    users: [
      { id: 'user1', name: '小莓', avatar: '🍓', email: 'berry@campushub.edu' },
      { id: 'user2', name: '奶茶', avatar: '🧋', email: 'milktea@campushub.edu' },
      { id: 'user3', name: '布丁', avatar: '🍮', email: 'pudding@campushub.edu' },
      { id: 'user4', name: '雪寶', avatar: '☁️', email: 'snow@campushub.edu' },
    ],
    posts: [
      {
        id: 'p1', userId: 'user1', title: '今天圖書館遇到的可愛貓貓',
        content: '在圖書館外面看到一隻三花貓，超級親人！一直蹭過來要摸摸，害我差點不想去唸書了🥹 有人也見過牠嗎？',
        category: '校園生活', likes: ['user2', 'user3'], createdAt: '2026-05-28T10:30:00Z',
      },
      {
        id: 'p2', userId: 'user2', title: '期末讀書團招募中！',
        content: '下週開始每週一三五在綜合大樓 302 教室，我們一起唸書互相督促吧～歡迎各系同學參加！有準備小點心喔 🍪',
        category: '學習', likes: ['user1', 'user4'], createdAt: '2026-05-27T14:20:00Z',
      },
      {
        id: 'p3', userId: 'user3', title: '學校附近新開的甜點店',
        content: '後門那條巷子新開了一家馬卡龍專賣店！口味好多而且不會太甜，配色超粉嫩超可愛～推薦給大家 💖',
        category: '美食', likes: ['user1', 'user2', 'user4'], createdAt: '2026-05-26T09:15:00Z',
      },
      {
        id: 'p4', userId: 'user4', title: '徵求網頁設計課隊友',
        content: '這學期的網頁設計期末專案要做一個電商網站，想找 2-3 位隊友一起合作。我有一些前端經驗，歡迎有興趣的同學私訊我！',
        category: '徵求', likes: ['user2'], createdAt: '2026-05-25T16:45:00Z',
      },
      {
        id: 'p5', userId: 'user1', title: '宿舍生活小撇步分享',
        content: '住了兩年宿舍整理的一些小技巧：1. 買一個小掛籃掛在床邊 2. 用壓縮袋收納冬季衣物 3. 備一個小電鍋真的超方便！大家還有什麼推薦的嗎？',
        category: '校園生活', likes: ['user3', 'user4'], createdAt: '2026-05-24T11:00:00Z',
      },
      {
        id: 'p6', userId: 'user2', title: '這學期最喜歡的課',
        content: '最喜歡的是「色彩學」，老師教了好多配色原理，現在看到漂亮的設計都會特別注意～作業雖然多但很有收穫！',
        category: '學習', likes: ['user1'], createdAt: '2026-05-23T08:30:00Z',
      },
    ],
    comments: [
      { id: 'c1', postId: 'p1', userId: 'user3', content: '好可愛！我也想去看看 🐱', createdAt: '2026-05-28T11:00:00Z' },
      { id: 'c2', postId: 'p1', userId: 'user2', content: '這隻我見過！牠叫小花，常常在圖書館附近出沒', createdAt: '2026-05-28T11:30:00Z' },
      { id: 'c3', postId: 'p2', userId: 'user1', content: '我要參加！會帶餅乾去分享 🍪', createdAt: '2026-05-27T15:00:00Z' },
      { id: 'c4', postId: 'p3', userId: 'user2', content: '昨天去買了！玫瑰口味超好吃', createdAt: '2026-05-26T10:00:00Z' },
      { id: 'c5', postId: 'p4', userId: 'user1', content: '我有興趣！已私訊你囉～', createdAt: '2026-05-25T17:00:00Z' },
      { id: 'c6', postId: 'p5', userId: 'user4', content: '小電鍋真的是必備！推推', createdAt: '2026-05-24T12:00:00Z' },
    ],
    products: [
      {
        id: 'prod1', name: '馬卡龍筆記本', price: 120, image: '📒',
        description: '粉色系馬卡龍封面筆記本，內頁有橫線與方格兩種格式，共 80 頁。',
        category: '文具',
      },
      {
        id: 'prod2', name: '校園帆布袋', price: 350, image: '👜',
        description: '純棉帆布袋，印有 CampusHub Logo，容量大又耐重，上課必備！',
        category: '配件',
      },
      {
        id: 'prod3', name: '馬卡龍色系筆組', price: 80, image: '🖊️',
        description: '一組 6 支，包含粉紅、薄荷綠、奶油黃、淡紫、天空藍、白色。書寫滑順。',
        category: '文具',
      },
      {
        id: 'prod4', name: '小熊保溫瓶', price: 290, image: '🧸',
        description: '不鏽鋼雙層真空保溫，保溫 12 小時，可愛小熊造型。',
        category: '生活',
      },
      {
        id: 'prod5', name: '馬卡龍小錢包', price: 180, image: '👛',
        description: '多層收納設計，零錢、卡片、鈔票都能裝，輕巧好攜帶。',
        category: '配件',
      },
      {
        id: 'prod6', name: '校園貼紙包', price: 50, image: '🌟',
        description: '一包 20 張，包含各種校園主題可愛插畫，適合裝飾筆記本。',
        category: '文具',
      },
    ],
    cart: {},
    emails: [
      {
        id: 'e1', from: '教授 張', to: 'user1', subject: '關於期末專案的提醒',
        body: '同學你好：\n\n期末專案的繳交截止日為 6/20，請記得準時繳交。若有任何問題，歡迎在 office hour 來找我討論。\n\n張教授',
        isRead: false, createdAt: '2026-06-01T09:00:00Z',
      },
      {
        id: 'e2', from: '教務處', to: 'user1', subject: '下學期選課時程通知',
        body: '親愛的同學：\n\n下學期選課即將開始，請留意以下時程：\n- 第一階段：6/5 - 6/10\n- 第二階段：6/15 - 6/20\n\n教務處 啟',
        isRead: true, createdAt: '2026-05-30T10:00:00Z',
      },
      {
        id: 'e3', from: '奶茶', to: 'user1', subject: '明天讀書會確認',
        body: '小莓～\n\n明天下午的讀書會在三點沒錯吧？我會帶手工餅乾過去！\n\n奶茶 🧋',
        isRead: false, createdAt: '2026-06-01T08:30:00Z',
      },
      {
        id: 'e4', from: '圖書館', to: 'user1', subject: '借書逾期通知',
        body: '同學您好：\n\n您借閱的「網頁設計入門」已逾期 3 天，請盡快歸還或辦理續借。\n\n圖書館',
        isRead: true, createdAt: '2026-05-29T14:00:00Z',
      },
      {
        id: 'e5', from: '布丁', to: 'user1', subject: '謝謝昨天的筆記！',
        body: '小莓～\n\n昨天借我的筆記已經抄完了！真的超感謝你～明天帶飲料請你喝 ☕\n\n布丁 🍮',
        isRead: false, createdAt: '2026-06-01T07:00:00Z',
      },
    ],
    courses: [
      { id: 'crs1', name: '網頁設計', code: 'CS2001', credits: 3, teacher: '張老師', grade: 88, schedule: '週二 10:00-12:00', classroom: '綜合大樓 501' },
      { id: 'crs2', name: '資料結構', code: 'CS2002', credits: 3, teacher: '李老師', grade: 82, schedule: '週三 13:00-15:00', classroom: '理工大樓 203' },
      { id: 'crs3', name: '線性代數', code: 'MATH1002', credits: 3, teacher: '王老師', grade: 90, schedule: '週一 09:00-11:00', classroom: '理學院 101' },
      { id: 'crs4', name: '英語聽講', code: 'EN1001', credits: 2, teacher: '陳老師', grade: 85, schedule: '週四 14:00-16:00', classroom: '語言中心 302' },
      { id: 'crs5', name: '色彩學', code: 'ART2001', credits: 2, teacher: '林老師', grade: 92, schedule: '週五 10:00-12:00', classroom: '設計大樓 401' },
    ],
    announcements: [
      { id: 'ann1', title: '期末考週公告', content: '期末考將於 6/15-6/20 舉行，請同學們提前準備。', createdAt: '2026-05-25T08:00:00Z' },
      { id: 'ann2', title: '校園馬拉松報名', content: '今年校園馬拉松開始報名囉！報名截止至 6/10。', createdAt: '2026-05-28T10:00:00Z' },
      { id: 'ann3', title: '暑假營隊志工招募', content: '暑期偏鄉服務營隊招募志工，有意者請至課活組報名。', createdAt: '2026-05-30T09:00:00Z' },
    ],
    projects: [
      {
        id: 'prj1', name: 'CampusHub 校園平台', owner: 'user1',
        description: '一個粉色系校園社群整合平台，包含社群、商店、信箱等功能。',
        readme: '# CampusHub\n\n這是一個校園社群整合平台，使用 Next.js 打造。\n\n## 功能\n- 社群討論\n- 商品瀏覽\n- 信件收發',
        stars: ['user2', 'user3'], createdAt: '2026-05-01T00:00:00Z',
      },
      {
        id: 'prj2', name: '美食地圖 App', owner: 'user2',
        description: '收集學校周邊美食資訊，還有食記分享功能。',
        readme: '# 美食地圖\n\n學校周邊美食大全！\n\n## 功能\n- 地圖顯示\n- 食記分享\n- 評分系統',
        stars: ['user1'], createdAt: '2026-04-20T00:00:00Z',
      },
      {
        id: 'prj3', name: '選課輔助系統', owner: 'user3',
        description: '幫助同學查詢課程評價、課表規劃的小工具。',
        readme: '# 選課輔助系統\n\n輕鬆規劃你的課表！\n\n## 功能\n- 課程搜尋\n- 課表排程\n- 評價查詢',
        stars: ['user1', 'user2', 'user4'], createdAt: '2026-03-15T00:00:00Z',
      },
    ],
    issues: [
      { id: 'iss1', projectId: 'prj1', userId: 'user2', title: '建議新增深色模式', content: '希望可以加上深色模式，晚上使用比較不傷眼睛。', createdAt: '2026-05-20T00:00:00Z' },
      { id: 'iss2', projectId: 'prj1', userId: 'user3', title: '購物車數量顯示問題', content: '加入商品後，購物車圖示上的數字有時候不會即時更新。', createdAt: '2026-05-22T00:00:00Z' },
      { id: 'iss3', projectId: 'prj2', userId: 'user1', title: '希望能新增照片上傳', content: '食記沒有照片感覺缺少說服力，希望可以上傳圖片。', createdAt: '2026-05-18T00:00:00Z' },
    ],
    scores: [
      { id: 's1', playerName: '小莓', score: 9800, createdAt: '2026-05-30T10:00:00Z' },
      { id: 's2', playerName: '奶茶', score: 8500, createdAt: '2026-05-29T14:00:00Z' },
      { id: 's3', playerName: '布丁', score: 7200, createdAt: '2026-05-28T09:00:00Z' },
      { id: 's4', playerName: '雪寶', score: 6500, createdAt: '2026-05-27T16:00:00Z' },
      { id: 's5', playerName: '小莓', score: 12300, createdAt: '2026-05-31T08:00:00Z' },
    ],
  };

  writeDB(seedData);
  console.log('Seed data created successfully!');
}
