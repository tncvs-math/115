const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const giftNames = ['上一段+進度表', '上二段', '上期末', '上補考', '下期初', '下一段+進度表', '下二段', '下期末', '下補考', '明年期初'];
const levels = [1, 2, 3];
let gifts = [];

// 標準禮物（等級 1~3）
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

// 額外禮物
gifts.push(
  { id: '4-1', name: '高一轉學考', level: 0, reservedBy: [] },
  { id: '4-2', name: '特色招生', level: 0, reservedBy: [] }
);

// 取得所有禮物
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
  } else {
    return res.json({ success: false, message: `${userName} 已預訂過此項目` });
  }
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
  } else {
    return res.json({ success: false, message: `${userName} 沒有預訂這項目` });
  }
});

// 一鍵清除功能
app.post('/clear', (req, res) => {
  gifts.forEach(g => g.reservedBy = []);
  res.json({ success: true, message: '所有預訂已清除' });
});

app.listen(port, () => {
  console.log(`伺服器啟動於 http://localhost:${port}`);
});
