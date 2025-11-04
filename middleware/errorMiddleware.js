/**
 * @file errorMiddleware.js
 * @description 定义了中央错误处理中间件。
 */

/**
 * @description 捕获所有路由和异步处理器中抛出的错误。
 * @param {Error} err - 抛出的错误对象
 * @param {import('express').Request} req - Express 请求对象
 * @param {import('express').Response} res - Express 响应对象
 * @param {import('express').NextFunction} next - Express next 中间件函数
 */
const errorHandler = (err, req, res, next) => {
  // 如果状态码是 200 (成功)，但却有错误抛出，说明是服务器内部错误，设为 500。
  // 否则，使用控制器中设置的错误状态码 (如 400, 401, 404)。
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode);

  // 以 JSON 格式返回错误信息
  res.json({
    message: err.message,
    // 在生产环境中隐藏堆栈信息，以防泄露敏感信息
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  errorHandler,
};