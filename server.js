/**
 * @file server.js
 * @description 这是 Express 应用的主入口文件。
 * 它负责初始化应用、加载配置、连接数据库、设置中间件、挂载路由以及启动服务器。
 */

// 导入核心依赖
const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');

// 导入自定义模块
const connectDB = require('./config/db'); // 假设数据库连接逻辑在 config/db.js
const { errorHandler } = require('./middleware/errorMiddleware');

// --- 1. 初始化和配置 ---

// 加载 .env 文件中的环境变量到 process.env
dotenv.config();

// 连接到 MongoDB 数据库
connectDB();

// 创建 Express 应用实例
const app = express();


// --- 2. 核心中间件 ---

// 启用 CORS (跨域资源共享)，允许前端应用访问此 API
// 建议放在所有路由和核心中间件的最前面
app.use(cors());

// 使用 Helmet 中间件来设置各种 HTTP 头，增强应用的安全性
app.use(helmet());

// 解析 JSON 格式的请求体
app.use(express.json());

// 解析 URL-encoded 格式的请求体
app.use(express.urlencoded({ extended: false }));


// --- 3. 路由挂载 ---

// 将不同模块的路由挂载到指定的 API 路径下
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));


// --- 4. 错误处理中间件 ---

// 挂载自定义的中央错误处理中间件，必须放在所有路由之后
app.use(errorHandler);


// --- 5. 启动服务器 ---

// 从环境变量中获取端口号，如果没有则默认为 5000
const PORT = process.env.PORT || 5000;

// 监听指定端口，并打印服务器运行状态信息
app.listen(PORT, () =>
  console.log(
    `服务器正在以 ${process.env.NODE_ENV || 'development'} 模式运行在端口 ${PORT} 上`
  )
);