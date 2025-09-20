#!/usr/bin/env node

/**
 * Simple CORS Proxy for Travel Saathi Development
 * This proxy handles CORS preflight requests and forwards them to the ADK server
 */

const http = require('http');
const https = require('https');
const url = require('url');

const PROXY_PORT = 8082;
const ADK_SERVER_URL = 'http://localhost:8081';

// CORS headers
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400'
};

function handleCORS(res) {
  Object.keys(CORS_HEADERS).forEach(key => {
    res.setHeader(key, CORS_HEADERS[key]);
  });
}

function proxyRequest(req, res) {
  const targetUrl = ADK_SERVER_URL + req.url;
  const parsedUrl = url.parse(targetUrl);
  
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: parsedUrl.path,
    method: req.method,
    headers: {
      ...req.headers,
      host: parsedUrl.host
    }
  };

  // Remove origin header to avoid CORS issues on the target server
  delete options.headers.origin;
  delete options.headers.host;

  const proxyReq = http.request(options, (proxyRes) => {
    // Set CORS headers
    handleCORS(res);
    
    // Copy response headers
    Object.keys(proxyRes.headers).forEach(key => {
      if (key.toLowerCase() !== 'access-control-allow-origin') {
        res.setHeader(key, proxyRes.headers[key]);
      }
    });
    
    res.statusCode = proxyRes.statusCode;
    
    // Pipe the response
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy request error:', err);
    handleCORS(res);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Proxy request failed', details: err.message }));
  });

  // Handle request body
  if (req.method === 'POST' || req.method === 'PUT') {
    req.pipe(proxyReq);
  } else {
    proxyReq.end();
  }
}

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    handleCORS(res);
    res.statusCode = 200;
    res.end();
    return;
  }
  
  // Proxy all other requests
  proxyRequest(req, res);
});

server.listen(PROXY_PORT, () => {
  console.log('🚀 CORS Proxy Server Started');
  console.log('================================');
  console.log(`📡 Proxy URL: http://localhost:${PROXY_PORT}`);
  console.log(`🎯 Target: ${ADK_SERVER_URL}`);
  console.log(`🌐 Frontend: http://localhost:3000`);
  console.log('================================');
  console.log('💡 Update your frontend to use: http://localhost:8082');
  console.log('🛑 Press Ctrl+C to stop');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down CORS proxy...');
  server.close(() => {
    console.log('✅ CORS proxy stopped');
    process.exit(0);
  });
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
