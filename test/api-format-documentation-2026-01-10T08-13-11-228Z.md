# API响应数据格式文档

生成时间: 2026/1/10 16:13:11

API地址: http://172.27.171.134:8000/api

## 测试总结

- 总测试数: 27
- 成功: 27
- 失败: 0
- 成功率: 100.00%

## SONGS

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/songs/

**状态**: 200

**响应时间**: 113ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "total": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page_size": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "results": {
      "type": "array",
      "length": 50,
      "itemType": "object",
      "sampleItem": {
        "id": 222,
        "styles": [
          "流行"
        ],
        "tags": [],
        "records": [
          {
            "id": 17227,
            "performed_at": "2025-07-13",
            "url": "https://player.bilibili.com/player.html?bvid=BV1LEuqzMEY5&p=6",
            "notes": null,
            "cover_url": "/covers/2025/07/2025-07-13.jpg",
            "song": 222
          },
          {
            "id": 3006,
            "performed_at": "2025-05-06",
            "url": "https://player.bilibili.com/player.html?bvid=BV1nTV8zTE9c&p=4",
            "notes": "",
            "cover_url": "covers/2025/05/2025-05-06.jpg",
            "song": 222
          },
          {
            "id": 3158,
            "performed_at": "2025-04-07",
            "url": "https://player.bilibili.com/player.html?bvid=BV1ZgdJYAE69&p=1",
            "notes": "",
            "cover_url": "covers/2025/04/2025-04-07.jpg",
            "song": 222
          },
          {
            "id": 3303,
            "performed_at": "2025-03-08",
            "url": "https://player.bilibili.com/player.html?bvid=BV1FqR8YaEPJ&p=3",
            "notes": "",
            "cover_url": "covers/2025/03/2025-03-08.jpg",
            "song": 222
          },
          {
            "id": 3314,
            "performed_at": "2025-03-06",
            "url": "https://player.bilibili.com/player.html?bvid=BV1Xb9CYnETQ&p=7",
            "notes": "",
            "cover_url": "covers/2025/03/2025-03-06.jpg",
            "song": 222
          },
          {
            "id": 3370,
            "performed_at": "2025-02-23",
            "url": "https://player.bilibili.com/player.html?bvid=BV1zaARenE3q&p=4",
            "notes": "",
            "cover_url": "covers/2025/02/2025-02-23.jpg",
            "song": 222
          },
          {
            "id": 3486,
            "performed_at": "2025-02-08",
            "url": "https://player.bilibili.com/player.html?bvid=BV1RJN1esEik&p=11",
            "notes": "",
            "cover_url": "covers/2025/02/2025-02-08.jpg",
            "song": 222
          },
          {
            "id": 3670,
            "performed_at": "2025-01-05",
            "url": "https://player.bilibili.com/player.html?bvid=BV1smrGY9Eij&p=4",
            "notes": "",
            "cover_url": "covers/2025/01/2025-01-05.jpg",
            "song": 222
          },
          {
            "id": 4396,
            "performed_at": "2024-09-01",
            "url": "https://player.bilibili.com/player.html?bvid=BV1KHH6eqETt&p=5",
            "notes": "",
            "cover_url": "covers/2024/09/2024-09-01.jpg",
            "song": 222
          },
          {
            "id": 4417,
            "performed_at": "2024-08-16",
            "url": "https://player.bilibili.com/player.html?bvid=BV1u142187Yt&p=1",
            "notes": "",
            "cover_url": "covers/2024/08/2024-08-16.jpg",
            "song": 222
          },
          {
            "id": 4432,
            "performed_at": "2024-08-15",
            "url": "https://player.bilibili.com/player.html?bvid=BV1rw4m1k7Ur&p=7",
            "notes": "",
            "cover_url": "covers/2024/08/2024-08-15.jpg",
            "song": 222
          },
          {
            "id": 4518,
            "performed_at": "2024-07-30",
            "url": "https://player.bilibili.com/player.html?bvid=BV1M4421S7yR&p=6",
            "notes": "",
            "cover_url": "covers/2024/07/2024-07-30.jpg",
            "song": 222
          },
          {
            "id": 4553,
            "performed_at": "2024-07-24",
            "url": "https://player.bilibili.com/player.html?bvid=BV14z421i7mW&p=3",
            "notes": "",
            "cover_url": "covers/2024/07/2024-07-24.jpg",
            "song": 222
          },
          {
            "id": 4585,
            "performed_at": "2024-07-20",
            "url": "https://player.bilibili.com/player.html?bvid=BV1nb421J7Zg&p=4",
            "notes": "",
            "cover_url": "covers/2024/07/2024-07-20.jpg",
            "song": 222
          },
          {
            "id": 4603,
            "performed_at": "2024-07-17",
            "url": "https://player.bilibili.com/player.html?bvid=BV1XH4y1w7QY&p=8",
            "notes": "",
            "cover_url": "covers/2024/07/2024-07-17.jpg",
            "song": 222
          }
        ],
        "song_name": "11",
        "singer": "邓紫棋",
        "last_performed": "2025-07-13",
        "perform_count": 15,
        "language": "国语"
      }
    }
  },
  "required": [
    "page",
    "page_size",
    "results",
    "total"
  ],
  "optional": [],
  "fieldCount": 4
}
```

**分页信息**:

- 总数: 1343
- 当前页: 1
- 页大小: 50
- 当前页结果数: 50

**列表项结构**:

```json
{
  "type": "object",
  "fields": {
    "id": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "styles": {
      "type": "array",
      "length": 1,
      "itemType": "string",
      "sampleItem": "流行"
    },
    "tags": {
      "type": "array",
      "length": 0,
      "itemType": "unknown"
    },
    "records": {
      "type": "array",
      "length": 15,
      "itemType": "object",
      "sampleItem": {
        "id": 17227,
        "performed_at": "2025-07-13",
        "url": "https://player.bilibili.com/player.html?bvid=BV1LEuqzMEY5&p=6",
        "notes": null,
        "cover_url": "/covers/2025/07/2025-07-13.jpg",
        "song": 222
      }
    },
    "song_name": {
      "type": "string",
      "length": 2,
      "sample": "11"
    },
    "singer": {
      "type": "string",
      "length": 3,
      "sample": "邓紫棋"
    },
    "last_performed": {
      "type": "string",
      "length": 10,
      "sample": "2025-07-13"
    },
    "perform_count": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "language": {
      "type": "string",
      "length": 2,
      "sample": "国语"
    }
  },
  "required": [
    "id",
    "language",
    "last_performed",
    "perform_count",
    "records",
    "singer",
    "song_name",
    "styles",
    "tags"
  ],
  "optional": [],
  "fieldCount": 9
}
```

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/songs/?q=%E6%B5%8B%E8%AF%95&page=1&limit=10

**状态**: 200

**响应时间**: 47ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "total": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page_size": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "results": {
      "type": "array",
      "length": 0,
      "itemType": "unknown"
    }
  },
  "required": [
    "page",
    "page_size",
    "results",
    "total"
  ],
  "optional": [],
  "fieldCount": 4
}
```

**分页信息**:

- 总数: 0
- 当前页: 1
- 页大小: 10
- 当前页结果数: 0

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/songs/?styles=%E6%B5%81%E8%A1%8C%2C%E6%91%87%E6%BB%9A

**状态**: 200

**响应时间**: 47ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "total": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page_size": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "results": {
      "type": "array",
      "length": 0,
      "itemType": "unknown"
    }
  },
  "required": [
    "page",
    "page_size",
    "results",
    "total"
  ],
  "optional": [],
  "fieldCount": 4
}
```

**分页信息**:

- 总数: 0
- 当前页: 1
- 页大小: 50
- 当前页结果数: 0

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/songs/?tags=%E7%BB%8F%E5%85%B8%2C%E7%83%AD%E9%97%A8

**状态**: 200

**响应时间**: 62ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "total": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page_size": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "results": {
      "type": "array",
      "length": 0,
      "itemType": "unknown"
    }
  },
  "required": [
    "page",
    "page_size",
    "results",
    "total"
  ],
  "optional": [],
  "fieldCount": 4
}
```

**分页信息**:

- 总数: 0
- 当前页: 1
- 页大小: 50
- 当前页结果数: 0

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/songs/?language=%E4%B8%AD%E6%96%87

**状态**: 200

**响应时间**: 65ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "total": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page_size": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "results": {
      "type": "array",
      "length": 0,
      "itemType": "unknown"
    }
  },
  "required": [
    "page",
    "page_size",
    "results",
    "total"
  ],
  "optional": [],
  "fieldCount": 4
}
```

**分页信息**:

- 总数: 0
- 当前页: 1
- 页大小: 50
- 当前页结果数: 0

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/songs/?ordering=singer

**状态**: 200

**响应时间**: 178ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "total": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page_size": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "results": {
      "type": "array",
      "length": 50,
      "itemType": "object",
      "sampleItem": {
        "id": 1259,
        "styles": [],
        "tags": [
          "remix"
        ],
        "records": [
          {
            "id": 3121,
            "performed_at": "2025-04-17",
            "url": "https://player.bilibili.com/player.html?bvid=BV1xT5kzUEh1&p=6",
            "notes": "",
            "cover_url": "covers/2025/04/2025-04-17.jpg",
            "song": 1259
          },
          {
            "id": 16415,
            "performed_at": "2021-04-28",
            "url": "https://player.bilibili.com/player.html?bvid=BV1ky4y1s7Fv&p=7",
            "notes": "",
            "cover_url": "covers/2021/04/2021-04-28.jpg",
            "song": 1259
          },
          {
            "id": 16416,
            "performed_at": "2020-10-15",
            "url": "https://player.bilibili.com/player.html?bvid=BV1VA411x7NJ&p=6",
            "notes": "",
            "cover_url": "covers/2020/10/2020-10-15.jpg",
            "song": 1259
          }
        ],
        "song_name": "欧若拉（下山）",
        "singer": null,
        "last_performed": "2025-04-17",
        "perform_count": 3,
        "language": null
      }
    }
  },
  "required": [
    "page",
    "page_size",
    "results",
    "total"
  ],
  "optional": [],
  "fieldCount": 4
}
```

**分页信息**:

- 总数: 1343
- 当前页: 1
- 页大小: 50
- 当前页结果数: 50

**列表项结构**:

```json
{
  "type": "object",
  "fields": {
    "id": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "styles": {
      "type": "array",
      "length": 0,
      "itemType": "unknown"
    },
    "tags": {
      "type": "array",
      "length": 1,
      "itemType": "string",
      "sampleItem": "remix"
    },
    "records": {
      "type": "array",
      "length": 3,
      "itemType": "object",
      "sampleItem": {
        "id": 3121,
        "performed_at": "2025-04-17",
        "url": "https://player.bilibili.com/player.html?bvid=BV1xT5kzUEh1&p=6",
        "notes": "",
        "cover_url": "covers/2025/04/2025-04-17.jpg",
        "song": 1259
      }
    },
    "song_name": {
      "type": "string",
      "length": 7,
      "sample": "欧若拉（下山）"
    },
    "singer": {
      "type": "null",
      "note": "空值"
    },
    "last_performed": {
      "type": "string",
      "length": 10,
      "sample": "2025-04-17"
    },
    "perform_count": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "language": {
      "type": "null",
      "note": "空值"
    }
  },
  "required": [
    "id",
    "last_performed",
    "perform_count",
    "records",
    "song_name",
    "styles",
    "tags"
  ],
  "optional": [
    "language",
    "singer"
  ],
  "fieldCount": 9
}
```

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/songs/?ordering=perform_count

**状态**: 200

**响应时间**: 92ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "total": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page_size": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "results": {
      "type": "array",
      "length": 50,
      "itemType": "object",
      "sampleItem": {
        "id": 56,
        "styles": [
          "流行",
          "RAP"
        ],
        "tags": [],
        "records": [],
        "song_name": "至高使命",
        "singer": "GAI周延",
        "last_performed": null,
        "perform_count": 0,
        "language": "国语"
      }
    }
  },
  "required": [
    "page",
    "page_size",
    "results",
    "total"
  ],
  "optional": [],
  "fieldCount": 4
}
```

**分页信息**:

- 总数: 1343
- 当前页: 1
- 页大小: 50
- 当前页结果数: 50

**列表项结构**:

```json
{
  "type": "object",
  "fields": {
    "id": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "styles": {
      "type": "array",
      "length": 2,
      "itemType": "string",
      "sampleItem": "流行"
    },
    "tags": {
      "type": "array",
      "length": 0,
      "itemType": "unknown"
    },
    "records": {
      "type": "array",
      "length": 0,
      "itemType": "unknown"
    },
    "song_name": {
      "type": "string",
      "length": 4,
      "sample": "至高使命"
    },
    "singer": {
      "type": "string",
      "length": 5,
      "sample": "GAI周延"
    },
    "last_performed": {
      "type": "null",
      "note": "空值"
    },
    "perform_count": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "language": {
      "type": "string",
      "length": 2,
      "sample": "国语"
    }
  },
  "required": [
    "id",
    "language",
    "perform_count",
    "records",
    "singer",
    "song_name",
    "styles",
    "tags"
  ],
  "optional": [
    "last_performed"
  ],
  "fieldCount": 9
}
```

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/songs/?page=2&limit=5

**状态**: 200

**响应时间**: 11ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "total": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page_size": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "results": {
      "type": "array",
      "length": 5,
      "itemType": "object",
      "sampleItem": {
        "id": 2294,
        "styles": [],
        "tags": [
          "小甜歌"
        ],
        "records": [
          {
            "id": 17886,
            "performed_at": "2025-11-27",
            "url": "https://player.bilibili.com/player.html?bvid=BV1QgSjBsENE&p=3",
            "notes": null,
            "cover_url": "/cover/2025/11/2025-11-27.jpg",
            "song": 2294
          },
          {
            "id": 17413,
            "performed_at": "2025-08-01",
            "url": "https://player.bilibili.com/player.html?bvid=BV1zKY6zjEed&p=5",
            "notes": null,
            "cover_url": "/covers/2025/08/2025-08-01.jpg",
            "song": 2294
          },
          {
            "id": 17250,
            "performed_at": "2025-07-19",
            "url": "https://player.bilibili.com/player.html?bvid=BV1pigtzZEus&p=5",
            "notes": null,
            "cover_url": "/covers/2025/07/2025-07-19.jpg",
            "song": 2294
          },
          {
            "id": 17178,
            "performed_at": "2025-07-09",
            "url": "https://player.bilibili.com/player.html?bvid=BV1wcGgz2Ez8&p=6",
            "notes": null,
            "cover_url": "/covers/2025/07/2025-07-09.jpg",
            "song": 2294
          },
          {
            "id": 17123,
            "performed_at": "2025-07-05",
            "url": "https://player.bilibili.com/player.html?bvid=BV1dM3ozYECZ&p=1",
            "notes": null,
            "cover_url": "/covers/2025/07/2025-07-05.jpg",
            "song": 2294
          },
          {
            "id": 17069,
            "performed_at": "2025-07-02",
            "url": "https://player.bilibili.com/player.html?bvid=BV1yr3bzTEfz&p=8",
            "notes": null,
            "cover_url": "/covers/2025/07/2025-07-02.jpg",
            "song": 2294
          },
          {
            "id": 15851,
            "performed_at": "2025-06-30",
            "url": "https://player.bilibili.com/player.html?bvid=BV1nKgCzeEFP&p=6",
            "notes": null,
            "cover_url": "/covers/2025/06/2025-06-30.jpg",
            "song": 2294
          },
          {
            "id": 15817,
            "performed_at": "2025-06-29",
            "url": "https://player.bilibili.com/player.html?bvid=BV14b3wzhEpC&p=4",
            "notes": null,
            "cover_url": "/covers/2025/06/2025-06-29.jpg",
            "song": 2294
          }
        ],
        "song_name": "99次我爱他",
        "singer": "元若蓝",
        "last_performed": "2025-11-27",
        "perform_count": 8,
        "language": "国语"
      }
    }
  },
  "required": [
    "page",
    "page_size",
    "results",
    "total"
  ],
  "optional": [],
  "fieldCount": 4
}
```

**分页信息**:

- 总数: 1343
- 当前页: 2
- 页大小: 5
- 当前页结果数: 5

**列表项结构**:

```json
{
  "type": "object",
  "fields": {
    "id": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "styles": {
      "type": "array",
      "length": 0,
      "itemType": "unknown"
    },
    "tags": {
      "type": "array",
      "length": 1,
      "itemType": "string",
      "sampleItem": "小甜歌"
    },
    "records": {
      "type": "array",
      "length": 8,
      "itemType": "object",
      "sampleItem": {
        "id": 17886,
        "performed_at": "2025-11-27",
        "url": "https://player.bilibili.com/player.html?bvid=BV1QgSjBsENE&p=3",
        "notes": null,
        "cover_url": "/cover/2025/11/2025-11-27.jpg",
        "song": 2294
      }
    },
    "song_name": {
      "type": "string",
      "length": 6,
      "sample": "99次我爱他"
    },
    "singer": {
      "type": "string",
      "length": 3,
      "sample": "元若蓝"
    },
    "last_performed": {
      "type": "string",
      "length": 10,
      "sample": "2025-11-27"
    },
    "perform_count": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "language": {
      "type": "string",
      "length": 2,
      "sample": "国语"
    }
  },
  "required": [
    "id",
    "language",
    "last_performed",
    "perform_count",
    "records",
    "singer",
    "song_name",
    "styles",
    "tags"
  ],
  "optional": [],
  "fieldCount": 9
}
```

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/songs/?limit=1000

**状态**: 200

**响应时间**: 71ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "total": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page_size": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "results": {
      "type": "array",
      "length": 50,
      "itemType": "object",
      "sampleItem": {
        "id": 222,
        "styles": [
          "流行"
        ],
        "tags": [],
        "records": [
          {
            "id": 17227,
            "performed_at": "2025-07-13",
            "url": "https://player.bilibili.com/player.html?bvid=BV1LEuqzMEY5&p=6",
            "notes": null,
            "cover_url": "/covers/2025/07/2025-07-13.jpg",
            "song": 222
          },
          {
            "id": 3006,
            "performed_at": "2025-05-06",
            "url": "https://player.bilibili.com/player.html?bvid=BV1nTV8zTE9c&p=4",
            "notes": "",
            "cover_url": "covers/2025/05/2025-05-06.jpg",
            "song": 222
          },
          {
            "id": 3158,
            "performed_at": "2025-04-07",
            "url": "https://player.bilibili.com/player.html?bvid=BV1ZgdJYAE69&p=1",
            "notes": "",
            "cover_url": "covers/2025/04/2025-04-07.jpg",
            "song": 222
          },
          {
            "id": 3303,
            "performed_at": "2025-03-08",
            "url": "https://player.bilibili.com/player.html?bvid=BV1FqR8YaEPJ&p=3",
            "notes": "",
            "cover_url": "covers/2025/03/2025-03-08.jpg",
            "song": 222
          },
          {
            "id": 3314,
            "performed_at": "2025-03-06",
            "url": "https://player.bilibili.com/player.html?bvid=BV1Xb9CYnETQ&p=7",
            "notes": "",
            "cover_url": "covers/2025/03/2025-03-06.jpg",
            "song": 222
          },
          {
            "id": 3370,
            "performed_at": "2025-02-23",
            "url": "https://player.bilibili.com/player.html?bvid=BV1zaARenE3q&p=4",
            "notes": "",
            "cover_url": "covers/2025/02/2025-02-23.jpg",
            "song": 222
          },
          {
            "id": 3486,
            "performed_at": "2025-02-08",
            "url": "https://player.bilibili.com/player.html?bvid=BV1RJN1esEik&p=11",
            "notes": "",
            "cover_url": "covers/2025/02/2025-02-08.jpg",
            "song": 222
          },
          {
            "id": 3670,
            "performed_at": "2025-01-05",
            "url": "https://player.bilibili.com/player.html?bvid=BV1smrGY9Eij&p=4",
            "notes": "",
            "cover_url": "covers/2025/01/2025-01-05.jpg",
            "song": 222
          },
          {
            "id": 4396,
            "performed_at": "2024-09-01",
            "url": "https://player.bilibili.com/player.html?bvid=BV1KHH6eqETt&p=5",
            "notes": "",
            "cover_url": "covers/2024/09/2024-09-01.jpg",
            "song": 222
          },
          {
            "id": 4417,
            "performed_at": "2024-08-16",
            "url": "https://player.bilibili.com/player.html?bvid=BV1u142187Yt&p=1",
            "notes": "",
            "cover_url": "covers/2024/08/2024-08-16.jpg",
            "song": 222
          },
          {
            "id": 4432,
            "performed_at": "2024-08-15",
            "url": "https://player.bilibili.com/player.html?bvid=BV1rw4m1k7Ur&p=7",
            "notes": "",
            "cover_url": "covers/2024/08/2024-08-15.jpg",
            "song": 222
          },
          {
            "id": 4518,
            "performed_at": "2024-07-30",
            "url": "https://player.bilibili.com/player.html?bvid=BV1M4421S7yR&p=6",
            "notes": "",
            "cover_url": "covers/2024/07/2024-07-30.jpg",
            "song": 222
          },
          {
            "id": 4553,
            "performed_at": "2024-07-24",
            "url": "https://player.bilibili.com/player.html?bvid=BV14z421i7mW&p=3",
            "notes": "",
            "cover_url": "covers/2024/07/2024-07-24.jpg",
            "song": 222
          },
          {
            "id": 4585,
            "performed_at": "2024-07-20",
            "url": "https://player.bilibili.com/player.html?bvid=BV1nb421J7Zg&p=4",
            "notes": "",
            "cover_url": "covers/2024/07/2024-07-20.jpg",
            "song": 222
          },
          {
            "id": 4603,
            "performed_at": "2024-07-17",
            "url": "https://player.bilibili.com/player.html?bvid=BV1XH4y1w7QY&p=8",
            "notes": "",
            "cover_url": "covers/2024/07/2024-07-17.jpg",
            "song": 222
          }
        ],
        "song_name": "11",
        "singer": "邓紫棋",
        "last_performed": "2025-07-13",
        "perform_count": 15,
        "language": "国语"
      }
    }
  },
  "required": [
    "page",
    "page_size",
    "results",
    "total"
  ],
  "optional": [],
  "fieldCount": 4
}
```

**分页信息**:

- 总数: 1343
- 当前页: 1
- 页大小: 50
- 当前页结果数: 50

**列表项结构**:

```json
{
  "type": "object",
  "fields": {
    "id": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "styles": {
      "type": "array",
      "length": 1,
      "itemType": "string",
      "sampleItem": "流行"
    },
    "tags": {
      "type": "array",
      "length": 0,
      "itemType": "unknown"
    },
    "records": {
      "type": "array",
      "length": 15,
      "itemType": "object",
      "sampleItem": {
        "id": 17227,
        "performed_at": "2025-07-13",
        "url": "https://player.bilibili.com/player.html?bvid=BV1LEuqzMEY5&p=6",
        "notes": null,
        "cover_url": "/covers/2025/07/2025-07-13.jpg",
        "song": 222
      }
    },
    "song_name": {
      "type": "string",
      "length": 2,
      "sample": "11"
    },
    "singer": {
      "type": "string",
      "length": 3,
      "sample": "邓紫棋"
    },
    "last_performed": {
      "type": "string",
      "length": 10,
      "sample": "2025-07-13"
    },
    "perform_count": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "language": {
      "type": "string",
      "length": 2,
      "sample": "国语"
    }
  },
  "required": [
    "id",
    "language",
    "last_performed",
    "perform_count",
    "records",
    "singer",
    "song_name",
    "styles",
    "tags"
  ],
  "optional": [],
  "fieldCount": 9
}
```

---

## RECORDS

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/songs/1/records/

**状态**: 200

**响应时间**: 48ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "total": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page_size": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "results": {
      "type": "array",
      "length": 0,
      "itemType": "unknown"
    }
  },
  "required": [
    "page",
    "page_size",
    "results",
    "total"
  ],
  "optional": [],
  "fieldCount": 4
}
```

**分页信息**:

- 总数: 0
- 当前页: 1
- 页大小: 20
- 当前页结果数: 0

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/songs/1/records/?page=1&page_size=5

**状态**: 200

**响应时间**: 60ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "total": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page_size": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "results": {
      "type": "array",
      "length": 0,
      "itemType": "unknown"
    }
  },
  "required": [
    "page",
    "page_size",
    "results",
    "total"
  ],
  "optional": [],
  "fieldCount": 4
}
```

**分页信息**:

- 总数: 0
- 当前页: 1
- 页大小: 5
- 当前页结果数: 0

---

## METADATA

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/styles/

**状态**: 200

**响应时间**: 46ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "array",
  "length": 7,
  "itemType": "string",
  "sampleItem": "RAP"
}
```

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/tags/

**状态**: 200

**响应时间**: 47ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "array",
  "length": 9,
  "itemType": "string",
  "sampleItem": "Ban位"
}
```

---

## TOPSONGS

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/top_songs/?range=all&limit=10

**状态**: 200

**响应时间**: 10ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "array",
  "length": 10,
  "itemType": "object",
  "sampleItem": {
    "id": 102,
    "song_name": "晚安喵",
    "singer": "艾索",
    "perform_count": 290,
    "last_performed": "2025-06-14"
  }
}
```

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/top_songs/?range=1m&limit=5

**状态**: 200

**响应时间**: 78ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "array",
  "length": 0,
  "itemType": "unknown"
}
```

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/top_songs/?range=3m&limit=5

**状态**: 200

**响应时间**: 62ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "array",
  "length": 5,
  "itemType": "object",
  "sampleItem": {
    "id": 302,
    "song_name": "唯一",
    "singer": "告五人（邓紫棋）",
    "perform_count": 2,
    "last_performed": "2025-11-30"
  }
}
```

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/top_songs/?range=1y&limit=5

**状态**: 200

**响应时间**: 62ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "array",
  "length": 5,
  "itemType": "object",
  "sampleItem": {
    "id": 302,
    "song_name": "唯一",
    "singer": "告五人（邓紫棋）",
    "perform_count": 13,
    "last_performed": "2025-11-30"
  }
}
```

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/top_songs/?range=10d&limit=5

**状态**: 200

**响应时间**: 60ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "array",
  "length": 0,
  "itemType": "unknown"
}
```

---

## RANDOM

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/random-song/

**状态**: 200

**响应时间**: 47ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "id": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "song_name": {
      "type": "string",
      "length": 5,
      "sample": "最初的记忆"
    },
    "singer": {
      "type": "string",
      "length": 3,
      "sample": "徐佳莹"
    },
    "styles": {
      "type": "array",
      "length": 1,
      "itemType": "string",
      "sampleItem": "流行"
    },
    "last_performed": {
      "type": "string",
      "length": 10,
      "sample": "2025-11-27"
    },
    "perform_count": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "language": {
      "type": "string",
      "length": 2,
      "sample": "国语"
    }
  },
  "required": [
    "id",
    "language",
    "last_performed",
    "perform_count",
    "singer",
    "song_name",
    "styles"
  ],
  "optional": [],
  "fieldCount": 7
}
```

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/recommendation/

**状态**: 200

**响应时间**: 47ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "content": {
      "type": "string",
      "length": 17,
      "sample": "站长墙裂推荐（欢迎多点点！！！）："
    },
    "recommended_songs": {
      "type": "array",
      "length": 4,
      "itemType": "object",
      "sampleItem": {
        "id": 849,
        "song_name": "宠坏",
        "singer": "小潘潘",
        "perform_count": 16
      }
    }
  },
  "required": [
    "content",
    "recommended_songs"
  ],
  "optional": [],
  "fieldCount": 2
}
```

---

## COLLECTIONS

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/fansDIY/collections/

**状态**: 200

**响应时间**: 4ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "total": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page_size": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "results": {
      "type": "array",
      "length": 8,
      "itemType": "object",
      "sampleItem": {
        "id": 13,
        "name": "七、点歌案例",
        "works_count": 4,
        "position": -4,
        "display_order": 0,
        "created_at": "2025-09-21T04:52:04.190544Z",
        "updated_at": "2025-09-21T04:55:19.079238Z"
      }
    }
  },
  "required": [
    "page",
    "page_size",
    "results",
    "total"
  ],
  "optional": [],
  "fieldCount": 4
}
```

**分页信息**:

- 总数: 8
- 当前页: 1
- 页大小: 20
- 当前页结果数: 8

**列表项结构**:

```json
{
  "type": "object",
  "fields": {
    "id": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "name": {
      "type": "string",
      "length": 6,
      "sample": "七、点歌案例"
    },
    "works_count": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "position": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "display_order": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "created_at": {
      "type": "string",
      "length": 27,
      "sample": "2025-09-21T04:52:04.190544Z"
    },
    "updated_at": {
      "type": "string",
      "length": 27,
      "sample": "2025-09-21T04:55:19.079238Z"
    }
  },
  "required": [
    "created_at",
    "display_order",
    "id",
    "name",
    "position",
    "updated_at",
    "works_count"
  ],
  "optional": [],
  "fieldCount": 7
}
```

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/fansDIY/collections/?page=1&limit=5

**状态**: 200

**响应时间**: 63ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "total": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page_size": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "results": {
      "type": "array",
      "length": 5,
      "itemType": "object",
      "sampleItem": {
        "id": 13,
        "name": "七、点歌案例",
        "works_count": 4,
        "position": -4,
        "display_order": 0,
        "created_at": "2025-09-21T04:52:04.190544Z",
        "updated_at": "2025-09-21T04:55:19.079238Z"
      }
    }
  },
  "required": [
    "page",
    "page_size",
    "results",
    "total"
  ],
  "optional": [],
  "fieldCount": 4
}
```

**分页信息**:

- 总数: 8
- 当前页: 1
- 页大小: 5
- 当前页结果数: 5

**列表项结构**:

```json
{
  "type": "object",
  "fields": {
    "id": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "name": {
      "type": "string",
      "length": 6,
      "sample": "七、点歌案例"
    },
    "works_count": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "position": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "display_order": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "created_at": {
      "type": "string",
      "length": 27,
      "sample": "2025-09-21T04:52:04.190544Z"
    },
    "updated_at": {
      "type": "string",
      "length": 27,
      "sample": "2025-09-21T04:55:19.079238Z"
    }
  },
  "required": [
    "created_at",
    "display_order",
    "id",
    "name",
    "position",
    "updated_at",
    "works_count"
  ],
  "optional": [],
  "fieldCount": 7
}
```

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/fansDIY/collections/1/

**状态**: 200

**响应时间**: 52ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "id": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "name": {
      "type": "string",
      "length": 6,
      "sample": "一、高能混剪"
    },
    "works_count": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "position": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "display_order": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "created_at": {
      "type": "string",
      "length": 27,
      "sample": "2025-09-18T06:55:46.182236Z"
    },
    "updated_at": {
      "type": "string",
      "length": 27,
      "sample": "2025-09-18T07:12:50.390566Z"
    }
  },
  "required": [
    "created_at",
    "display_order",
    "id",
    "name",
    "position",
    "updated_at",
    "works_count"
  ],
  "optional": [],
  "fieldCount": 7
}
```

---

## WORKS

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/fansDIY/works/

**状态**: 200

**响应时间**: 12ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "total": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page_size": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "results": {
      "type": "array",
      "length": 20,
      "itemType": "object",
      "sampleItem": {
        "id": 41,
        "title": "生日会上的小感慨",
        "cover_url": "/footprint/Collection/diy3/2025-03-21.jpg",
        "view_url": "https://player.bilibili.com/player.html?bvid=BV1FpXCYaEo8",
        "author": "咻咻满的大鸡腿",
        "notes": "2025 生日感慨",
        "position": -2,
        "display_order": 0,
        "collection": {
          "id": 9,
          "name": "三、历年生日"
        }
      }
    }
  },
  "required": [
    "page",
    "page_size",
    "results",
    "total"
  ],
  "optional": [],
  "fieldCount": 4
}
```

**分页信息**:

- 总数: 76
- 当前页: 1
- 页大小: 20
- 当前页结果数: 20

**列表项结构**:

```json
{
  "type": "object",
  "fields": {
    "id": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "title": {
      "type": "string",
      "length": 8,
      "sample": "生日会上的小感慨"
    },
    "cover_url": {
      "type": "string",
      "length": 41,
      "sample": "/footprint/Collection/diy3/2025-03-21.jpg"
    },
    "view_url": {
      "type": "string",
      "length": 57,
      "sample": "https://player.bilibili.com/player.html?bvid=BV1Fp..."
    },
    "author": {
      "type": "string",
      "length": 7,
      "sample": "咻咻满的大鸡腿"
    },
    "notes": {
      "type": "string",
      "length": 9,
      "sample": "2025 生日感慨"
    },
    "position": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "display_order": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "collection": {
      "type": "object",
      "fields": {
        "id": {
          "type": "number",
          "isInteger": true,
          "range": "integer"
        },
        "name": {
          "type": "string",
          "length": 6,
          "sample": "三、历年生日"
        }
      },
      "required": [
        "id",
        "name"
      ],
      "optional": [],
      "fieldCount": 2
    }
  },
  "required": [
    "author",
    "collection",
    "cover_url",
    "display_order",
    "id",
    "notes",
    "position",
    "title",
    "view_url"
  ],
  "optional": [],
  "fieldCount": 9
}
```

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/fansDIY/works/?page=1&limit=5

**状态**: 200

**响应时间**: 11ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "total": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page_size": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "results": {
      "type": "array",
      "length": 5,
      "itemType": "object",
      "sampleItem": {
        "id": 41,
        "title": "生日会上的小感慨",
        "cover_url": "/footprint/Collection/diy3/2025-03-21.jpg",
        "view_url": "https://player.bilibili.com/player.html?bvid=BV1FpXCYaEo8",
        "author": "咻咻满的大鸡腿",
        "notes": "2025 生日感慨",
        "position": -2,
        "display_order": 0,
        "collection": {
          "id": 9,
          "name": "三、历年生日"
        }
      }
    }
  },
  "required": [
    "page",
    "page_size",
    "results",
    "total"
  ],
  "optional": [],
  "fieldCount": 4
}
```

**分页信息**:

- 总数: 76
- 当前页: 1
- 页大小: 5
- 当前页结果数: 5

**列表项结构**:

```json
{
  "type": "object",
  "fields": {
    "id": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "title": {
      "type": "string",
      "length": 8,
      "sample": "生日会上的小感慨"
    },
    "cover_url": {
      "type": "string",
      "length": 41,
      "sample": "/footprint/Collection/diy3/2025-03-21.jpg"
    },
    "view_url": {
      "type": "string",
      "length": 57,
      "sample": "https://player.bilibili.com/player.html?bvid=BV1Fp..."
    },
    "author": {
      "type": "string",
      "length": 7,
      "sample": "咻咻满的大鸡腿"
    },
    "notes": {
      "type": "string",
      "length": 9,
      "sample": "2025 生日感慨"
    },
    "position": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "display_order": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "collection": {
      "type": "object",
      "fields": {
        "id": {
          "type": "number",
          "isInteger": true,
          "range": "integer"
        },
        "name": {
          "type": "string",
          "length": 6,
          "sample": "三、历年生日"
        }
      },
      "required": [
        "id",
        "name"
      ],
      "optional": [],
      "fieldCount": 2
    }
  },
  "required": [
    "author",
    "collection",
    "cover_url",
    "display_order",
    "id",
    "notes",
    "position",
    "title",
    "view_url"
  ],
  "optional": [],
  "fieldCount": 9
}
```

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/fansDIY/works/?collection=1

**状态**: 200

**响应时间**: 13ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "total": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "page_size": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "results": {
      "type": "array",
      "length": 16,
      "itemType": "object",
      "sampleItem": {
        "id": 17,
        "title": "【周深×咻咻满】《人是_》 伪合唱～",
        "cover_url": "/footprint/Collection/diy0/2023-02-10.jpg",
        "view_url": "https://player.bilibili.com/player.html?bvid=BV1vM4y1Q7V2",
        "author": "yoyowon7",
        "notes": "",
        "position": 0,
        "display_order": 0,
        "collection": {
          "id": 1,
          "name": "一、高能混剪"
        }
      }
    }
  },
  "required": [
    "page",
    "page_size",
    "results",
    "total"
  ],
  "optional": [],
  "fieldCount": 4
}
```

**分页信息**:

- 总数: 16
- 当前页: 1
- 页大小: 20
- 当前页结果数: 16

**列表项结构**:

```json
{
  "type": "object",
  "fields": {
    "id": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "title": {
      "type": "string",
      "length": 18,
      "sample": "【周深×咻咻满】《人是_》 伪合唱～"
    },
    "cover_url": {
      "type": "string",
      "length": 41,
      "sample": "/footprint/Collection/diy0/2023-02-10.jpg"
    },
    "view_url": {
      "type": "string",
      "length": 57,
      "sample": "https://player.bilibili.com/player.html?bvid=BV1vM..."
    },
    "author": {
      "type": "string",
      "length": 8,
      "sample": "yoyowon7"
    },
    "notes": {
      "type": "string",
      "length": 0,
      "sample": ""
    },
    "position": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "display_order": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "collection": {
      "type": "object",
      "fields": {
        "id": {
          "type": "number",
          "isInteger": true,
          "range": "integer"
        },
        "name": {
          "type": "string",
          "length": 6,
          "sample": "一、高能混剪"
        }
      },
      "required": [
        "id",
        "name"
      ],
      "optional": [],
      "fieldCount": 2
    }
  },
  "required": [
    "author",
    "collection",
    "cover_url",
    "display_order",
    "id",
    "position",
    "title",
    "view_url"
  ],
  "optional": [
    "notes"
  ],
  "fieldCount": 9
}
```

---

### ✅ undefined

**URL**: http://172.27.171.134:8000/api/fansDIY/works/1/

**状态**: 200

**响应时间**: 48ms

**Content-Type**: application/json

**数据结构**:

```json
{
  "type": "object",
  "fields": {
    "id": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "title": {
      "type": "string",
      "length": 21,
      "sample": "【邓紫棋×咻咻满】来自天堂的魔鬼（伪合唱）"
    },
    "cover_url": {
      "type": "string",
      "length": 41,
      "sample": "/footprint/Collection/diy0/2024-08-04.jpg"
    },
    "view_url": {
      "type": "string",
      "length": 57,
      "sample": "https://player.bilibili.com/player.html?bvid=BV18d..."
    },
    "author": {
      "type": "string",
      "length": 8,
      "sample": "yoyowon7"
    },
    "notes": {
      "type": "string",
      "length": 0,
      "sample": ""
    },
    "position": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "display_order": {
      "type": "number",
      "isInteger": true,
      "range": "integer"
    },
    "collection": {
      "type": "object",
      "fields": {
        "id": {
          "type": "number",
          "isInteger": true,
          "range": "integer"
        },
        "name": {
          "type": "string",
          "length": 6,
          "sample": "一、高能混剪"
        }
      },
      "required": [
        "id",
        "name"
      ],
      "optional": [],
      "fieldCount": 2
    }
  },
  "required": [
    "author",
    "collection",
    "cover_url",
    "display_order",
    "id",
    "position",
    "title",
    "view_url"
  ],
  "optional": [
    "notes"
  ],
  "fieldCount": 9
}
```

---

