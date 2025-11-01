# 个人作品集与博客后端 API

这是一个为个人作品集和博客前端应用提供数据支持的 RESTful API。它使用 Node.js, Express, และ MongoDB 构建，并实现了完整的用户认证和内容管理功能。

**线上 API 地址:** `https://lishaners-portfolio-blog-api.onrender.com`

---

## 主要功能

*   **作品集管理:** 对个人项目进行完整的 CRUD (增删改查) 操作。
*   **博客系统:** 功能齐全的博客文章和评论管理。
*   **用户认证:** 基于 JWT (JSON Web Tokens) 的安全注册和登录系统。
*   **权限控制:** 受保护的路由确保只有授权用户（或内容所有者）才能进行敏感操作。
*   **安全设计:** 使用 `bcrypt` 进行密码哈希，使用 `helmet` 保护 HTTP 请求头。
*   **集中式错误处理:** 提供统一、规范的错误响应格式。

---

## 技术栈

*   **后端框架:** Node.js, Express.js
*   **数据库:** MongoDB (使用 Mongoose ODM)
*   **认证:** JSON Web Tokens (JWT)
*   **密码加密:** bcrypt.js
*   **环境变量管理:** dotenv
*   **安全:** helmet.js

---

## API 端点文档

### 用户认证 (Authentication)

| 方法   | 路径                  | 描述                             | 访问权限 |
| :----- | :-------------------- | :------------------------------- | :------- |
| `POST` | `/api/users/register` | 注册一个新用户。                 | 公开     |
| `POST` | `/api/users/login`    | 用户登录，成功后返回 JWT。       | 公开     |

### 作品集项目 (Portfolio Projects)

| 方法     | 路径                | 描述                       | 访问权限 |
| :------- | :------------------ | :------------------------- | :------- |
| `GET`    | `/api/projects`     | 获取所有项目列表。         | 公开     |
| `GET`    | `/api/projects/:id` | 获取单个项目的详细信息。   | 公开     |
| `POST`   | `/api/projects`     | 创建一个新项目。           | 受保护   |
| `PUT`    | `/api/projects/:id` | 更新一个指定的项目。       | 受保护   |
| `DELETE` | `/api/projects/:id` | 删除一个指定的项目。       | 受保护   |

### 博客文章 (Blog Posts)

| 方法     | 路径              | 描述                                       | 访问权限         |
| :------- | :---------------- | :----------------------------------------- | :--------------- |
| `GET`    | `/api/blog`       | 获取所有博客文章列表（包含作者信息）。     | 公开             |
| `GET`    | `/api/blog/:id`   | 获取单篇文章详情（包含作者和评论）。       | 公开             |
| `POST`   | `/api/blog`       | 创建一篇新文章。                           | 受保护           |
| `PUT`    | `/api/blog/:id`   | 更新一篇文章（仅限作者本人）。             | 受保护 & 需授权  |
| `DELETE` | `/api/blog/:id`   | 删除一篇文章（仅限作者本人）。             | 受保护 & 需授权  |

### 博客评论 (Blog Comments)

| 方法   | 路径                             | 描述                           | 访问权限 |
| :----- | :------------------------------- | :----------------------------- | :------- |
| `GET`  | `/api/blog/:postId/comments`     | 获取指定文章下的所有评论。     | 公开     |
| `POST` | `/api/blog/:postId/comments`     | 为指定文章创建一条新评论。     | 受保护   |

### 联系表单 (Contact Form)

| 方法   | 路径            | 描述                       | 访问权限 |
| :----- | :-------------- | :------------------------- | :------- |
| `POST` | `/api/contact`  | 接收并存储访客的留言信息。 | 公开     |

---

## 项目安装与本地运行

1.  **克隆仓库**
    ```bash
    git clone https://github.com/lishaner/Portfolio-blog-api
    cd Portfolio-blog-api
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **设置环境变量**
    *   在项目根目录创建一个 `.env` 文件。
    *   复制 `.env.example` (如果有) 的内容到 `.env` 文件中，并填入您的配置：
      ```env
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_super_secret_key
      PORT=5000
      ```

4.  **启动开发服务器**
    ```bash
    npm run dev
    ```

5.  **启动生产服务器**
    ```bash
    npm start
    ```