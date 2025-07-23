const express = require('express');
const client = require('prom-client');

const register = new client.Registry();

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duração das requisições HTTP em segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 1.5, 2, 5]
});

register.registerMetric(httpRequestDuration);

client.collectDefaultMetrics({ register });

const app = express();
app.use(express.json())

// midd para medir tempo da req
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
});

app.get('/', (req, res) => {
  res.send('Hello, Metrics!');
});

app.get('/random', async (req, res) => {
  const value = Math.random() * 100;

  const delay = Math.floor(Math.random() * 300);
  setTimeout(() => {
    res.json({ value: value.toFixed(2) });
  }, delay);
});


app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(4000, () => console.log('running on 4k'));