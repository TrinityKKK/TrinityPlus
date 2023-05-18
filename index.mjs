import createBareServer from "@tomphttp/bare-server-node";
import { fileURLToPath } from "node:url";  
import http from 'http';
import fs from 'fs';
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
const bare = createBareServer("/bare/");
const app = connect();
import serveStatic from "serve-static";
import connect from "connect";
import createRammerhead from 'rammerhead/src/server/index.js';
const server = http.createServer();
const rh = createRammerhead();
const routes = {
    '/games': 'games.html',
    '/apps': 'apps.html',
    '/': 'index.html'
  };
  app.use('/uv', (req, res, next) => {
    serveStatic(uvPath)(req, res, next);
  });
function handleRoutes(req, res, next) {
    const real = routes[req.url];
    if (real) {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html");
      res.end(fs.readFileSync(`./routes/${real}`));
    } else {
next();
    }
}
app.use(handleRoutes)
const rammerheadScopes = [
	'/rammerhead.js',
	'/hammerhead.js',
	'/transport-worker.js',
	'/task.js',
	'/iframe-task.js',
	'/worker-hammerhead.js',
	'/messaging',
	'/sessionexists',
	'/deletesession',
	'/newsession',
	'/editsession',
	'/needpassword',
	'/syncLocalStorage',
	'/api/shuffleDict',
];
app.use(serveStatic(fileURLToPath(new URL("./static/", import.meta.url))));
function shouldRouteRh(req) {
    const RHurl = new URL(req.url, 'http://0.0.0.0');
    return (
      rammerheadScopes.includes(RHurl.pathname) ||
      rammerheadSession.test(RHurl.pathname)
    );
  }
  function routeRhRequest(req, res) {
    rh.emit('request', req, res);
  }
  //@ts-ignore
  function routeRhUpgrade(req, socket, head) {
      try {
        rh.emit('upgrade', req, socket, head);
      }
      catch (error) {}
    }
  const rammerheadSession = /^\/[a-z0-9]{32}/;

  app.use((req, res, next) => {
    if(bare.shouldRoute(req)) bare.routeRequest(req, res); else next();
  });
  app.use((req, res, next) => {
    if (shouldRouteRh(req)) {
      routeRhRequest(req, res);
    } else {
      next();
    }
  });
  app.use((req, res, next) => {
    const url = req.url;
    if (url.endsWith('.html')) {
      res.statusCode = 404;
      next();
    } else {
      if (url.endsWith('/')) {
        res.statusCode = 404;
        next();
      } else {
      next();
    }
  }});
  app.use((req, res, next) => {
    if (req.upgrade) {
      routeRhUpgrade(req, req.socket, req.head);
    } else {
      next();
    }
  });
  app.use((req, res) => {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.end(fs.readFileSync('./404.html'));
  });
  server.on("request", app);
server.on('upgrade', (req, socket, head) => {
  if (bare.shouldRoute(req)) {
      bare.routeUpgrade(req, socket, head);
  } 
  else if (shouldRouteRh(req)) {
      try {
          routeRhUpgrade(req, socket, head);
      }
      catch (error) {}
  }
  else {
      socket.end();
  }
});
  server.on("listening", () => {
    const addr = server.address();
  
    console.log(`Server running on port ${addr.port}`)
    console.log("");
    console.log("You can now view it in your browser.")
  });
server.listen(process.env.PORT || 80)