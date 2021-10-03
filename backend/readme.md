Colab
Markdown

$$ \int_a^b x^2 \mathrm{d} x $$

```py
print("test")
```

Typora

# 前端

- 帳號/會員
  - [x] 登入頁面
  - 註冊頁面
    - [ ] 申請成為老師 (需要審核)
    - [ ] 申請成為家長 (手機號碼驗證)
  - [x] Line 登入
- 對老師
  - [x] 查看紀錄 - 我的應徵
  - [x] 看單 - 家教列表
  - [x] 接單 - 應徵家教列表
  - [x] 查看上課紀錄
    - [ ] 填寫課程紀錄 - 我的課程紀錄
- 對家長
  - [x] 查看紀錄 - 我的家教清單
    - [ ] 查看應徵者
    - [ ] 接受應徵者
  - [x] 發單 - 張貼家教
  - [x] 查看上課紀錄
    - [ ] 填寫課程紀錄 - 我的課程紀錄

# 後端

- 使用者 Users
  - [x] 登入
  - [x] 註冊
  - [ ] 手機審核
    - [ ] migration
  - [ ] Email 驗證
    - [ ] migration
  - [x] 登出
  - [x] Line 登入
- 課程紀錄 ClassRecord
  - [x] 老師填寫課程紀錄
  - [x] 學生填寫課程紀錄
  - [x] 列出我的課程紀錄
- 訂單 Orders
  - [x] 列出訂單
  - [x] 家長建立訂單
  - [x] 家長受老師 accept_order
  - [x] 我的訂單列表 (家長)
  - [x] 訂單細節
  - [x] 我的應徵訂單列表 (教師)
  - [ ] 針對訂單編號，列出所有應徵者
- 應徵 Application
  - [x] 老師申請應徵

# 桌面版獨立管理介面

- [ ] 審核

# DevOps

- 平台上線

## 2021/08/12

- 送審按鈕
- 送審 Table 設計
- 帳戶等待審核 Migration
- 送審 API 設計

- 感謝送審頁面
- 帳戶等待審核頁面
- 補件畫面

---

- 清掉冗於畫面元素
- 改善使用者體驗

---

- 手機號碼驗證頁面

---

- 填寫課程紀錄 (老師、學生)

---

- 查看應徵者
- 接受應徵者