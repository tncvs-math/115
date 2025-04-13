const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const giftNames = ['上一段+進度表', '上二段', '上期末', '上補考', '下期初', '下一段+進度表', '下二段', '下期末', '下補考', '明年期初'];
const levels = [1, 2, 3];

let gifts = [];

// 初始化禮物
function initGifts() {
  gifts = [];
  levels.forEach(level => {
    giftNames.forEach((name, index) => {
      gifts.push({
        id: `${level}-${index + 1}`,
        level,
        name,
        reservedBy: []
      });
    });
  });

  // 額外項目 level = 0
  gifts.push({ id: 'extra-1', level: 0, name: '額外命題 A', reservedBy: [] });
  gifts.push({ id: 'extra-2', level: 0, name: '額外命題 B', reservedBy: [] });
}

initGifts();

// 取得禮物清單
app.get('/gifts', (req, res) => {
  res.json(gifts);
});

// 預訂
app.post('/reserve', (req, res) => {
  const { userName, giftId } = req.body;
  const gift = gifts.find(g => g.id === giftId);
  if (!gift) return res.json({ success: false, message: '找不到該編號' });
  if (!gift.reservedBy.includes(userName)) {
    gift.reservedBy.push(userName);
    return res.json({ success: true, message: `已為 ${userName} 預訂 ${gift.name}` });
  }
  res.json({ success: false, message: `${userName} 已預訂過此項目` });
});

// 取消預訂
app.post('/remove', (req, res) => {
  const { userName, giftId } = req.body;
  const gift = gifts.find(g => g.id === giftId);
  if (!gift) return res.json({ success: false, message: '找不到該編號' });

  const index = gift.reservedBy.indexOf(userName);
  if (index > -1) {
    gift.reservedBy.splice(index, 1);
    return res.json({ success: true, message: `${userName} 的預訂已取消` });
  }
  res.json({ success: false, message: `${userName} 沒有預訂這項目` });
});

// 清除所有預訂
app.post('/clear', (req, res) => {
  gifts.forEach(g => g.reservedBy = []);
  res.json({ success: true, message: '所有預訂資料已清除' });
});

app.listen(port, () => {
  console.log(`伺服器啟動於 http://localhost:${port}`);
});
