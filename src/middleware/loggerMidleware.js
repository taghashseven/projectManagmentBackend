const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.get('User-Agent'),
      query: req.query,
      body: req.body,
    };

    console.log(JSON.stringify(log, null, 2)); // Pretty print for development
  });

  next();
};

export default requestLogger;
