## Quick Start
```bash
docker-compose up -d
```

frontent home page: http:0.0.0.0:3050   
document page: http:0.0.0.0:3050/docs   

## 實現訊息提醒任務即將到期
### schema design
*Task 表新增* 
- reminder_before  string(optional)  在到期前提醒設定 // hour, day, week
- remind_at timestamp(optional)  通知時間

*Notification 表*
| 欄位           | 型別        | 說明                                                     |
| -------------- | ----------- | -------------------------------------------------------- |
| `id`          | Increment (PK) | 通知記錄唯一 ID                                          |
| `user_id`     | INT         | 要通知的使用者（對應 users.id）                          |
| `task_id`     | INT         | 通知所屬的任務（對應 tasks.id）                           |
| `message`     | TEXT        | 通知內容                                                 |
| `is_sent`     | BOOLEAN     | 是否已發送（若為 Email, push notification，需要知道是否送出） |
| `created_at`  | TIMESTAMP   | 建立時間                                                 |
| `updated_at`  | TIMESTAMP   | 更新時間       

### How It Work
1. 計算remind_at
- 當使用者更新reminder_before時，計算出remind_at 的時間
2. worker 定時任務
- 每幾分鐘掃描一次，當remind_at <= 當前時間，表示需要通知
3. 建立通知
- 在資料庫建立一筆通知紀錄
- 發送通知，可能使用websocket, Long polling 或是以郵件方式通知等

## 定時重複任務
### schema design
*Task 表新增* 
- recurrence  string(optional)  重複週期設定 // daily, weekly, monthly...
### How It Work
1. 使用者透過介面設定recurrence 欄位
2. worker 定時任務
- 每幾分鐘掃描是否有已完成的任務並且recurrence不為null的
- 獲取資料後計算下一次到期日期，並更新due_date 欄位

## File Structure
### backend
src
├── app
│   ├── app.module                     root module
│   ├── config                         env setup
│   ├── main
│   ├── error.handler
│   ├── errors                         define error
│   ├── auth                           auth module
│   ├── task                           task module
│   │   ├── controller                 Api endpoint
│   │   ├── dto                        define api schema
│   │   ├── entity                     define DB table
│   │   ├── interface                  define service, repository interface
│   │   ├── mapper                     db, domain model mapper
│   │   ├── model                      domain model
│   │   ├── module
│   │   ├── repo                       repository implement
│   │   ├── service                    service implement
│   │   │
│   ├── team                           team module
│   ├── user                           user module
├── public                             static file
└── migrations                         migration files


## Migrations
```bash
# generate migration
$ npx typeorm-ts-node-commonjs migration:generate migration/<> -d data-source.ts

# upgrade
$ npx typeorm-ts-node-commonjs migration:run -d data-source.ts

# downgrade
$ npx typeorm-ts-node-commonjs migration:revert -d data-source.ts
```