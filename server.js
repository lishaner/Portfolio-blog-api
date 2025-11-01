const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const connectDB = require('./config/db'); // 确保此路径正确
const { errorHandler } = require('./middleware/errorMiddleware'); // 确保此路径正确

// 加载 .env 文件中的环境变量
dotenv.config();

// 连接到 MongoDB 数据库
connectDB();

const app = express();

// --- 核心中间件 ---
app.use(helmet()); // 自动设置多种安全相关的 HTTP 头
app.use(express.json()); // 用于解析 JSON 格式的请求体
app.use(express.urlencoded({ extended: false })); // 用于解析 URL-encoded 格式的请求体

// --- 路由挂载 ---
// 我们将为项目中存在的每一个路由文件都进行挂载
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));



// --- 错误处理中间件 ---
// 必须放在所有路由挂载之后，才能捕获它们抛出的错误
app.use(errorHandler);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `服务器正在以 ${process.env.NODE_ENV || 'development'} 模式运行在端口 ${PORT} 上`
  )
);