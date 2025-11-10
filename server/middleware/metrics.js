// server/middleware/metrics.js
const metrics = {
  requests: [],
  startTime: Date.now(),
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  responseTimes: [],

  recordRequest(req, res, responseTime, success) {
    this.requests.push({
      timestamp: Date.now(),
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      responseTime,
      success,
    });

    this.totalRequests++;
    if (success) {
      this.successfulRequests++;
    } else {
      this.failedRequests++;
    }
    this.responseTimes.push(responseTime);

    // Keep only last 24 hours of requests for daily data
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000;
    this.requests = this.requests.filter(r => r.timestamp > twentyFourHoursAgo);
    
    // Keep only last 1000 response times for performance
    if (this.responseTimes.length > 1000) {
      this.responseTimes = this.responseTimes.slice(-1000);
    }
  },

  getSuccessRate() {
    if (this.totalRequests === 0) return 100;
    return parseFloat(((this.successfulRequests / this.totalRequests) * 100).toFixed(2));
  },

  getAverageResponseTime() {
    if (this.responseTimes.length === 0) return 0;
    const sum = this.responseTimes.reduce((a, b) => a + b, 0);
    return parseFloat((sum / this.responseTimes.length).toFixed(2));
  },

  getUptime() {
    return Math.floor((Date.now() - this.startTime) / 1000); // in seconds
  },

  getUptimePercentage() {
    // For a simple server, uptime is 100% if it's running.
    // More complex logic needed for actual service monitoring.
    return 100;
  },

  getRequestsByDay(days) {
    const data = {};
    const now = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - (days - 1 - i));
      const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      data[dateKey] = {
        date: dateKey,
        requests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        responseTimes: [],
      };
    }

    this.requests.forEach(request => {
      const requestDate = new Date(request.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (data[requestDate]) {
        data[requestDate].requests++;
        if (request.success) {
          data[requestDate].successfulRequests++;
        } else {
          data[requestDate].failedRequests++;
        }
        data[requestDate].responseTimes.push(request.responseTime);
      }
    });

    const result = Object.values(data).map(day => ({
      date: day.date,
      'API Requests': day.requests,
      'Success Rate': day.requests === 0 ? 100 : parseFloat(((day.successfulRequests / day.requests) * 100).toFixed(2)),
      'Response Time': day.responseTimes.length === 0 ? 0 : parseFloat((day.responseTimes.reduce((a, b) => a + b, 0) / day.responseTimes.length).toFixed(2)),
    }));

    return result;
  },

  getSummary() {
    return {
      totalRequests: this.totalRequests,
      successfulRequests: this.successfulRequests,
      failedRequests: this.failedRequests,
      successRate: this.getSuccessRate(),
      averageResponseTime: this.getAverageResponseTime(),
      uptime: this.getUptime(),
      uptimePercentage: this.getUptimePercentage(),
    };
  },

  reset() {
    this.requests = [];
    this.startTime = Date.now();
    this.totalRequests = 0;
    this.successfulRequests = 0;
    this.failedRequests = 0;
    this.responseTimes = [];
  },
};

export const trackMetrics = (req, res, next) => {
  const startTime = Date.now();

  const originalSend = res.send;
  res.send = function(data) {
    const responseTime = Date.now() - startTime;
    const success = res.statusCode >= 200 && res.statusCode < 400;

    // Don't track health check requests
    if (req.path !== '/api/health') {
      metrics.recordRequest(req, res, responseTime, success);
    }

    return originalSend.call(this, data);
  };

  next();
};

export const getMetrics = (req, res) => {
  const { period = 'last-7-days' } = req.query;

  const days = period === 'last-7-days' ? 7 : period === 'last-30-days' ? 30 : 90;
  const requestsByDay = metrics.getRequestsByDay(days);

  const summary = metrics.getSummary();

  res.json({
    success: true,
    data: {
      summary: {
        totalRequests: summary.totalRequests,
        successRate: summary.successRate,
        averageResponseTime: summary.averageResponseTime,
        uptime: summary.uptime,
        uptimePercentage: summary.uptimePercentage,
      },
      dailyData: requestsByDay.map(day => ({
        date: day.date,
        'API Requests': parseFloat(day['API Requests']),
        'Success Rate': parseFloat(day['Success Rate']),
        'Response Time': parseFloat(day['Response Time']),
      })),
      detailedMetrics: [
        {
          id: 'response-time',
          label: 'Avg Response Time',
          value: `${summary.averageResponseTime}ms`,
          trend: summary.averageResponseTime < 100 ? 'down' : 'up',
        },
        {
          id: 'success-rate',
          label: 'Success Rate',
          value: `${summary.successRate}%`,
          trend: summary.successRate >= 95 ? 'up' : 'down',
        },
        {
          id: 'active-connections',
          label: 'Database Status',
          value: 'Connected',
          trend: 'stable',
        },
      ],
    },
  });
};

export default metrics;

