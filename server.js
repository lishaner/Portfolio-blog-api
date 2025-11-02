const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors'); // <--- 1. 在顶部导入 cors 包
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// 加载 .env 文件中的环境变量
dotenv.config();

// 连接到 MongoDB 数据库
connectDB();

const app = express();

// --- 核心中间件 ---

// 2. 将 cors() 中间件放在所有核心中间件的最前面
// 这将为您的所有 API 路由启用跨域资源共享 (CORS)
app.use(cors());

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- 路由挂载 ---
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/blog', require('./routes/blogRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// --- 错误处理中间件 ---
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `服务器正在以 ${process.env.NODE_ENV || 'development'} 模式运行在端口 ${PORT} 上`
  )
);