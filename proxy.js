const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors({
    exposedHeaders: ['OData-Version', 'Content-Type']
}));

app.use((req, res, next) => {
    if (req.url.includes('$batch')) {
        res.setHeader('OData-Version', '4.0');
        res.setHeader('Content-Type', 'multipart/mixed;boundary=batch_');
    }
    next();
});

const proxy = createProxyMiddleware({
    target: "http://localhost:4004/odata/v4/product/",
    changeOrigin: true,
    pathRewrite: {
        '^/odata': ''
    },
    onProxyReq: (proxyReq, req, res) => {
        if (req.headers.authorization) {
            proxyReq.setHeader('Authorization', req.headers.authorization);
        }
        
        proxyReq.setHeader('OData-Version', '4.0');
        proxyReq.setHeader('Accept', 'application/json;odata.metadata=minimal;IEEE754Compatible=true');
        
        if (req.url.includes('$batch')) {
            proxyReq.setHeader('Content-Type', 'multipart/mixed;boundary=batch_');
        }
    },
});

app.use("/odata", proxy);

app.listen(4000, () => {
    console.log('Proxy server running at http://localhost:4000');
});