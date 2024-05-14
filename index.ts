import { swapQuote } from "./markets/orca_whirpools/sdk/client/swap_quotes";

const http = require('http');
const app = require('./app');

const normalizePort = (val: any) => {
    const port = parseInt(val, 10);
  
    if (isNaN(port)) {
      return val;
    }
    if (port >= 0) {
      return port;
    }
    return false;
  };
  const port = normalizePort(process.env.PORT || '3000');
  app.set('port', port);

const server = http.createServer(app);

const errorHandler = (error: any) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);

// app.use((request: any, response: any) => {
//     response.json({ message: 'Hey! This is your server response baby!' }); 
//   });  

app.get('/orca_quote', async function (req: any, res: any) {
  let result = await swapQuote();
  res.json({
    estimatedAmountIn: result.estimatedAmountIn,
    estimatedAmountOut: result.estimatedAmountOut,
  })
});
