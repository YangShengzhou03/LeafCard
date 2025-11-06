# Leaf Card 卡密管理系统 API 文档

## 概述

Leaf Card 是一个卡密管理系统，提供用户管理、产品管理、规格管理、卡密管理等功能。本文档详细描述了所有API接口的前端请求格式和后端响应格式。

## 基础信息

- **基础URL**: `http://localhost:8080/api`
- **认证方式**: JWT Bearer Token
- **数据格式**: JSON
- **字符编码**: UTF-8
- **开发环境**: 本地开发环境端口 8080

## 通用响应格式

### 成功响应
```json
{
    "code": 200,
    "message": "success",
    "data": {}
}
```

### 错误响应
```json
{
    "code": 400,
    "message": "错误信息",
    "data": null
}
```

### 分页响应格式
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [],
        "total": 0,
        "size": 10,
        "current": 1,
        "pages": 1
    }
}
```

## 认证管理 API

### 1. 用户登录

**接口地址**: `POST /api/auth/login`

**请求头**: 无需认证

**请求参数**:
```json
{
    "email": "admin@leafcard.com",
    "password": "123456"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "登录成功",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "id": 1,
            "username": "admin",
            "email": "admin@leafcard.com",
            "passwordHash": "123456",
            "status": "active",
            "lastLoginTime": "2024-01-15T14:30:00",
            "createdAt": "2024-01-01T00:00:00",
            "updatedAt": "2024-01-15T14:30:00"
        }
    }
}
```

### 2. 获取当前用户信息

**接口地址**: `GET /api/auth/me`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "username": "admin",
        "email": "admin@leafcard.com",
        "passwordHash": "123456",
        "status": "active",
        "lastLoginTime": "2024-01-15T14:30:00",
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-15T14:30:00"
    }
}
```

### 3. 更新当前用户信息

**接口地址**: `PUT /api/auth/me`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "username": "updated_admin",
    "email": "updated_admin@leafcard.com",
    "passwordHash": "new_password"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "用户信息更新成功",
    "data": true
}
```

### 4. 用户注册

**接口地址**: `POST /api/auth/register`

**请求头**: 无需认证

**请求参数**:
```json
{
    "username": "newuser",
    "email": "newuser@leafcard.com",
    "passwordHash": "123456",
    "status": "active"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "注册成功",
    "data": true
}
```

### 5. 用户登出

**接口地址**: `POST /api/auth/logout`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "登出成功",
    "data": true
}
```

## 管理员管理 API

### 1. 获取管理员列表

**接口地址**: `GET /api/admins`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**查询参数**:
- `page` (可选): 页码，默认1
- `size` (可选): 页大小，默认10

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [
            {
                "id": 1,
                "username": "admin",
                "email": "admin@leafcard.com",
                "status": "active",
                "lastLoginTime": "2024-01-15T14:30:00",
                "createdAt": "2024-01-01T00:00:00",
                "updatedAt": "2024-01-15T14:30:00"
            }
        ],
        "total": 1,
        "size": 10,
        "current": 1,
        "pages": 1
    }
}
```

### 2. 创建管理员

**接口地址**: `POST /api/admins`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "username": "newadmin",
    "email": "newadmin@leafcard.com",
    "passwordHash": "123456",
    "status": "active"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "管理员创建成功",
    "data": true
}
```

### 3. 更新管理员

**接口地址**: `PUT /api/admins/{id}`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "username": "updated_admin",
    "email": "updated_admin@leafcard.com",
    "passwordHash": "new_password"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "管理员更新成功",
    "data": true
}
```

### 4. 删除管理员

**接口地址**: `DELETE /api/admins/{id}`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "管理员删除成功",
    "data": true
}
```

## 产品管理 API

### 1. 分页查询产品列表

**接口地址**: `GET /api/products`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**查询参数**:
- `page` (可选): 页码，默认1
- `size` (可选): 页大小，默认10
- `category` (可选): 产品分类
- `status` (可选): 产品状态

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [
            {
                "id": 1,
                "name": "VIP会员",
                "description": "VIP会员专属权益，享受高级服务",
                "category": "virtual",
                "status": "active",
                "createdAt": "2024-01-01T00:00:00",
                "updatedAt": "2024-01-01T00:00:00"
            }
        ],
        "total": 5,
        "size": 10,
        "current": 1,
        "pages": 1
    }
}
```

### 2. 根据ID查询产品

**接口地址**: `GET /api/products/{id}`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "name": "VIP会员",
        "description": "VIP会员专属权益，享受高级服务",
        "category": "virtual",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-01T00:00:00"
    }
}
```

### 3. 创建产品

**接口地址**: `POST /api/products`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "name": "新产品",
    "description": "新产品描述",
    "category": "virtual",
    "status": "active"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "产品创建成功",
    "data": true
}
```

### 4. 更新产品

**接口地址**: `PUT /api/products/{id}`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "name": "更新后的产品名",
    "description": "更新后的描述",
    "category": "virtual",
    "status": "active"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "产品更新成功",
    "data": true
}
```

### 5. 删除产品

**接口地址**: `DELETE /api/products/{id}`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "产品删除成功",
    "data": true
}
```

### 6. 获取产品统计信息

**接口地址**: `GET /api/products/statistics`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "totalProducts": 10,
        "activeProducts": 8,
        "inactiveProducts": 2,
        "virtualProducts": 6,
        "physicalProducts": 4
    }
}
```

### 7. 根据分类获取产品

**接口地址**: `GET /api/products/category/{category}`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "name": "VIP会员",
            "description": "VIP会员专属权益，享受高级服务",
            "category": "virtual",
            "status": "active",
            "createdAt": "2024-01-01T00:00:00",
            "updatedAt": "2024-01-01T00:00:00"
        }
    ]
}
```

## 规格管理 API

### 1. 分页查询规格列表

**接口地址**: `GET /api/specifications`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**查询参数**:
- `page` (可选): 页码，默认1
- `size` (可选): 页大小，默认10

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [
            {
                "id": 1,
                "productId": 1,
                "name": "月卡",
                "description": "VIP会员专属月卡，享受专属权益",
                "durationDays": 30,
                "price": 29.9,
                "stockQuantity": 1000,
                "status": "active",
                "createdAt": "2024-01-01T00:00:00",
                "updatedAt": "2024-01-01T00:00:00"
            }
        ],
        "total": 8,
        "size": 10,
        "current": 1,
        "pages": 1
    }
}
```

### 2. 根据ID查询规格

**接口地址**: `GET /api/specifications/{id}`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "productId": 1,
        "name": "月卡",
        "description": "VIP会员专属月卡，享受专属权益",
        "durationDays": 30,
        "price": 29.9,
        "stockQuantity": 1000,
        "status": "active",
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-01T00:00:00"
    }
}
```

### 3. 根据产品ID查询规格列表

**接口地址**: `GET /api/specifications/product/{productId}`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "productId": 1,
            "name": "月卡",
            "description": "VIP会员专属月卡，享受专属权益",
            "durationDays": 30,
            "price": 29.9,
            "stockQuantity": 1000,
            "status": "active",
            "createdAt": "2024-01-01T00:00:00",
            "updatedAt": "2024-01-01T00:00:00"
        }
    ]
}
```

### 4. 根据状态查询规格列表

**接口地址**: `GET /api/specifications/status/{status}`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "productId": 1,
            "name": "月卡",
            "description": "VIP会员专属月卡，享受专属权益",
            "durationDays": 30,
            "price": 29.9,
            "stockQuantity": 1000,
            "status": "active",
            "createdAt": "2024-01-01T00:00:00",
            "updatedAt": "2024-01-01T00:00:00"
        }
    ]
}
```

### 5. 创建规格

**接口地址**: `POST /api/specifications`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "productId": 1,
    "name": "季卡",
    "description": "VIP会员专属季卡，享受专属权益",
    "durationDays": 90,
    "price": 79.9,
    "stockQuantity": 500,
    "status": "active"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "规格创建成功",
    "data": true
}
```

### 6. 更新规格

**接口地址**: `PUT /api/specifications/{id}`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "name": "更新后的规格名",
    "description": "更新后的描述",
    "durationDays": 60,
    "price": 49.9,
    "stockQuantity": 800,
    "status": "active"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "规格更新成功",
    "data": true
}
```

### 7. 删除规格

**接口地址**: `DELETE /api/specifications/{id}`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "规格删除成功",
    "data": true
}
```

### 8. 获取规格统计信息

**接口地址**: `GET /api/specifications/statistics`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "totalSpecifications": 15,
        "activeSpecifications": 12,
        "inactiveSpecifications": 3,
        "totalStock": 15000
    }
}
```

### 9. 获取规格DTO列表（包含卡密统计信息）

**接口地址**: `GET /api/specifications/dto`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "productId": 1,
            "name": "月卡",
            "description": "VIP会员专属月卡，享受专属权益",
            "durationDays": 30,
            "price": 29.9,
            "stockQuantity": 1000,
            "status": "active",
            "createdAt": "2024-01-01T00:00:00",
            "updatedAt": "2024-01-01T00:00:00",
            "totalCards": 500,
            "usedCards": 200,
            "unusedCards": 300
        }
    ]
}
```

## 卡密管理 API

### 1. 分页查询卡密列表

**接口地址**: `GET /api/card-keys`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**查询参数**:
- `page` (可选): 页码，默认1
- `size` (可选): 页大小，默认10
- `status` (可选): 卡密状态

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [
            {
                "id": 1,
                "cardKey": "LEAF-2024-001-ABCD-EFGH",
                "specificationId": 1,
                "status": "未使用",
                "userId": null,
                "userEmail": null,
                "activateTime": null,
                "expireTime": null,
                "createdAt": "2024-01-01T00:00:00",
                "updatedAt": "2024-01-01T00:00:00"
            }
        ],
        "total": 10,
        "size": 10,
        "current": 1,
        "pages": 1
    }
}
```

### 2. 获取包含商品和规格名称的卡密列表

**接口地址**: `GET /api/card-keys/with-details`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "cardKey": "LEAF-2024-001-ABCD-EFGH",
            "specificationId": 1,
            "specificationName": "月卡",
            "productName": "VIP会员",
            "status": "未使用",
            "userId": null,
            "userEmail": null,
            "activateTime": null,
            "expireTime": null,
            "createdAt": "2024-01-01T00:00:00",
            "updatedAt": "2024-01-01T00:00:00"
        }
    ]
}
```

### 3. 搜索卡密

**接口地址**: `GET /api/card-keys/search`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**查询参数**:
- `cardKey` (必填): 卡密关键字

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "cardKey": "LEAF-2024-001-ABCD-EFGH",
        "specificationId": 1,
        "status": "未使用",
        "userId": null,
        "userEmail": null,
        "activateTime": null,
        "expireTime": null,
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-01T00:00:00"
    }
}
```

### 4. 验证卡密

**接口地址**: `GET /api/card-keys/verify/{cardKey}`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "id": 1,
        "cardKey": "LEAF-2024-001-ABCD-EFGH",
        "specificationId": 1,
        "status": "未使用",
        "userId": null,
        "userEmail": null,
        "activateTime": null,
        "expireTime": null,
        "createdAt": "2024-01-01T00:00:00",
        "updatedAt": "2024-01-01T00:00:00"
    }
}
```

### 5. 激活卡密

**接口地址**: `POST /api/card-keys/{cardKey}/activate`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "userId": "user-uuid",
    "userEmail": "user@example.com"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "卡密激活成功",
    "data": true
}
```

### 6. 禁用卡密

**接口地址**: `POST /api/card-keys/{cardKey}/disable`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "卡密禁用成功",
    "data": true
}
```

### 7. 获取卡密统计信息

**接口地址**: `GET /api/card-keys/statistics`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "totalCards": 10,
        "unusedCards": 6,
        "usedCards": 3,
        "disabledCards": 1
    }
}
```

### 8. 创建卡密

**接口地址**: `POST /api/card-keys`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "cardKey": "LEAF-2024-002-ABCD-EFGH",
    "specificationId": 1,
    "status": "未使用"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "卡密创建成功",
    "data": true
}
```

### 9. 删除卡密

**接口地址**: `DELETE /api/card-keys/{cardKey}`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "卡密删除成功",
    "data": true
}
```

### 10. 切换卡密状态

**接口地址**: `POST /api/card-keys/{cardKey}/status`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "status": "已使用"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "卡密状态更新成功",
    "data": true
}
```

## 公共卡密验证激活 API

### 验证并激活安装密钥

**接口地址**: `GET /api/public/card-keys/verify/{cardKey}`

**请求头**: 无需认证

**说明**: 验证安装密钥，验证成功时会自动使用该密钥（将未使用状态变为已使用）

**响应示例**:
```json
{
    "code": 200,
    "message": "验证成功",
    "data": "VIP会员-月卡"
}
```

**错误响应示例**:
```json
{
    "code": 400,
    "message": "该密钥已被使用"
}
```
        "usedCards": 3,
        "disabledCards": 1
    }
}
```

### 8. 创建卡密

**接口地址**: `POST /api/card-keys`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "cardKey": "LEAF-2024-002-ABCD-EFGH",
    "specificationId": 1,
    "status": "未使用"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "卡密创建成功",
    "data": true
}
```

### 9. 删除卡密

**接口地址**: `DELETE /api/card-keys/{cardKey}`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "卡密删除成功",
    "data": true
}
```

### 10. 切换卡密状态

**接口地址**: `POST /api/card-keys/{cardKey}/status`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "status": "已使用"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "卡密状态更新成功",
    "data": true
}
```

## 操作日志 API

### 1. 分页查询操作日志列表（支持时间范围筛选）

**接口地址**: `GET /api/operation-logs`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**查询参数**:
- `page` (可选): 页码，默认1
- `size` (可选): 页大小，默认10
- `startDate` (可选): 开始日期，格式：yyyy-MM-dd
- `endDate` (可选): 结束日期，格式：yyyy-MM-dd
- `operationType` (可选): 操作类型
- `adminId` (可选): 管理员ID

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "records": [
            {
                "id": 1,
                "adminId": "admin-uuid",
                "operationType": "CREATE",
                "targetType": "PRODUCT",
                "targetId": 1,
                "description": "创建新产品",
                "ipAddress": "192.168.1.100",
                "createdAt": "2024-01-01T00:00:00"
            }
        ],
        "total": 10,
        "size": 10,
        "current": 1,
        "pages": 1
    }
}
```

### 2. 获取日志统计信息

**接口地址**: `GET /api/operation-logs/stats`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**查询参数**:
- `startDate` (可选): 开始日期，格式：yyyy-MM-dd
- `endDate` (可选): 结束日期，格式：yyyy-MM-dd

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": {
        "totalLogs": 100,
        "todayLogs": 5,
        "yesterdayLogs": 8,
        "thisWeekLogs": 25,
        "thisMonthLogs": 80
    }
}
```

### 3. 根据管理员ID查询操作日志

**接口地址**: `GET /api/operation-logs/admin/{adminId}`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "adminId": "admin-uuid",
            "operationType": "CREATE",
            "targetType": "PRODUCT",
            "targetId": 1,
            "description": "创建新产品",
            "ipAddress": "192.168.1.100",
            "createdAt": "2024-01-01T00:00:00"
        }
    ]
}
```

### 4. 根据操作类型查询操作日志

**接口地址**: `GET /api/operation-logs/type/{operationType}`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "adminId": "admin-uuid",
            "operationType": "CREATE",
            "targetType": "PRODUCT",
            "targetId": 1,
            "description": "创建新产品",
            "ipAddress": "192.168.1.100",
            "createdAt": "2024-01-01T00:00:00"
        }
    ]
}
```

### 5. 根据目标查询操作日志

**接口地址**: `GET /api/operation-logs/target`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**查询参数**:
- `targetType` (必填): 目标类型
- `targetId` (必填): 目标ID

**响应示例**:
```json
{
    "code": 200,
    "message": "success",
    "data": [
        {
            "id": 1,
            "adminId": "admin-uuid",
            "operationType": "CREATE",
            "targetType": "PRODUCT",
            "targetId": 1,
            "description": "创建新产品",
            "ipAddress": "192.168.1.100",
            "createdAt": "2024-01-01T00:00:00"
        }
    ]
}
```

### 6. 导出操作日志

**接口地址**: `GET /api/operation-logs/export`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**查询参数**:
- `startDate` (可选): 开始日期，格式：yyyy-MM-dd
- `endDate` (可选): 结束日期，格式：yyyy-MM-dd

**响应**: 返回Excel文件下载

### 7. 清空操作日志

**接口地址**: `DELETE /api/operation-logs`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**响应示例**:
```json
{
    "code": 200,
    "message": "日志清空成功",
    "data": true
}
```

### 8. 记录操作日志

**接口地址**: `POST /api/operation-logs`

**请求头**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**请求参数**:
```json
{
    "operationType": "操作类型",
    "description": "操作描述",
    "ipAddress": "IP地址"
}
```

**响应示例**:
```json
{
    "code": 200,
    "message": "操作日志记录成功",
    "data": true
}
```

## 前端请求示例

### Vue.js + Axios 示例

```javascript
import Server from '../utils/Server'

// 管理员服务示例
const AdminService = {
  // 管理员登录
  login(data) {
    return Server.post('/api/admins/login', data)
  },

  // 管理员注册
  register(data) {
    return Server.post('/api/admins', data)
  },

  // 获取仪表盘统计数据
  getDashboardStats() {
    return Server.get('/api/admin/stats')
  },

  // 获取管理员列表
  getUserList(params) {
    return Server.get('/api/admins', { 
      page: params.page || 1, 
      size: params.size || 10 
    })
  },

  // 获取操作日志列表
  getLogList(params) {
    return Server.get('/api/operation-logs', {
      page: params.page || 1,
      size: params.size || 10,
      startDate: params.startDate,
      endDate: params.endDate,
      operationType: params.operationType,
      adminId: params.adminId
    })
  },

  // 导出操作日志
  exportLogs(params) {
    return Server.get('/api/operation-logs/export', {
      startDate: params.startDate,
      endDate: params.endDate
    }, { responseType: 'blob' })
  },

  // 获取包含商品和规格名称的卡密列表
  getCardKeyListWithDetails() {
    return Server.get('/api/card-keys/with-details')
  },

  // 生成卡密
  generateCardKey(data) {
    return Server.post('/api/card-keys', data)
  },

  // 切换卡密状态
  toggleCardKeyStatus(id, status) {
    return Server.post(`/api/card-keys/${id}/status`, { status })
  },

  // 禁用卡密
  disableCardKey(id) {
    return Server.post(`/api/card-keys/${id}/disable`)
  },

  // 删除卡密
  deleteCardKey(id) {
    return Server.delete(`/api/card-keys/${id}`)
  },

  // 获取产品列表
  getProductList(params) {
    return Server.get('/api/products', {
      page: params.page || 1,
      size: params.size || 10,
      category: params.category,
      status: params.status
    })
  },

  // 创建产品
  createProduct(data) {
    return Server.post('/api/products', data)
  },

  // 编辑产品
  editProduct(id, data) {
    return Server.put(`/api/products/${id}`, data)
  },

  // 删除产品
  deleteProduct(id) {
    return Server.delete(`/api/products/${id}`)
  },

  // 获取规格列表
  getSpecList(params) {
    return Server.get('/api/specifications', {
      page: params.page || 1,
      size: params.size || 10
    })
  },

  // 创建规格
  createSpec(data) {
    return Server.post('/api/specifications', data)
  },

  // 编辑规格
  editSpec(id, data) {
    return Server.put(`/api/specifications/${id}`, data)
  },

  // 删除规格
  deleteSpec(id) {
    return Server.delete(`/api/specifications/${id}`)
  },

  // 根据ID获取规格
  getSpecificationById(id) {
    return Server.get(`/api/specifications/${id}`)
  }
}

// 用户服务示例
const UserService = {
  // 用户登录
  login(data) {
    return Server.post('/api/auth/login', data)
  },

  // 用户登出
  logout() {
    return Server.post('/api/auth/logout')
  },

  // 用户注册
  register(data) {
    return Server.post('/api/auth/register', data)
  },

  // 获取当前用户信息
  getCurrentUser() {
    return Server.get('/api/auth/me')
  },

  // 获取存储信息
  getStorageInfo() {
    return Server.get('/api/user/storage')
  }
}

// 使用示例
async function exampleUsage() {
  try {
    // 管理员登录
    const loginResponse = await AdminService.login({
      email: 'admin@example.com',
      password: 'password123'
    })
    console.log('登录成功:', loginResponse.data)

    // 获取产品列表
    const productsResponse = await AdminService.getProductList({
      page: 1,
      size: 10
    })
    console.log('产品列表:', productsResponse.data)

    // 获取卡密列表
    const cardKeysResponse = await AdminService.getCardKeyListWithDetails()
    console.log('卡密列表:', cardKeysResponse.data)

  } catch (error) {
    console.error('API调用失败:', error)
  }
}

export default {
  admin: AdminService,
  user: UserService
}
```

## 错误码说明

| 错误码 | 说明 | 描述 |
|--------|------|------|
| 200 | 成功 | 请求成功 |
| 400 | 请求错误 | 请求参数错误或格式不正确 |
| 401 | 未授权访问 | 用户未登录或token过期 |
| 403 | 权限不足 | 用户权限不足 |
| 404 | 资源不存在 | 请求的资源不存在 |
| 500 | 服务器内部错误 | 服务器内部处理错误 |

### 常见错误场景

**认证相关错误**:
- 401: 未授权访问 - 用户未登录或token过期
- 403: 权限不足 - 用户权限不足

**资源相关错误**:
- 404: 资源不存在 - 请求的产品、规格、卡密等资源不存在

**业务逻辑错误**:
- 400: 请求错误 - 卡密已使用、卡密已禁用、产品已禁用等业务逻辑错误

**系统错误**:
- 500: 服务器内部错误 - 数据库连接失败、系统异常等

## 部署说明

### 后端部署

1. 配置数据库连接信息
2. 执行数据库初始化脚本
3. 打包项目：`mvn clean package`
4. 运行：`java -jar target/leaf-card-backend-1.0.0.jar`

### 前端部署

1. 安装依赖：`npm install`
2. 构建项目：`npm run build`
3. 部署到Web服务器

## 注意事项

1. 所有时间字段使用ISO 8601格式
2. 金额字段使用数字类型，单位为元
3. 分页查询默认页码为1，页大小为10
4. 生产环境请配置HTTPS和安全的认证方式