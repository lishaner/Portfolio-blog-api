/**
 * 中央错误处理中间件
 * @param {Error} err - 抛出的错误对象
 * @param {import('express').Request} req - Express 请求对象
 * @param {import('express').Response} res - Express 响应对象
 * @param {import('express').NextFunction} next - Express next 中间件函数
 */
const errorHandler = (err, req, res, next) => {
  // 检查 res.statusCode。如果它仍然是 200 (默认成功状态码),
  // 这意味着错误是在一个成功的 HTTP 周期中被抛出的, 我们应该将其视为服务器内部错误 (500)。
  // 否则, 使用由控制器设置的特定错误状态码 (如 400, 401, 404)。
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // 使用我们决定的状态码来设置响应头
  res.status(statusCode);

  // 发送 JSON 格式的错误响应
  res.json({
    message: err.message,
    // 在生产环境中不应该暴露堆栈信息, 这对安全很重要。
    // 我们只在非生产环境 (如 'development') 中包含它, 以便调试。
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};