import path from 'path';
import zlib from 'zlib';
import koa from 'koa';
import cors from 'kcors';
import route from 'koa-route';
import logger from 'koa-logger';
import favicon from 'koa-favicon';
import compress from 'koa-compress';
import serve from 'koa-static';
import views from 'koa-views';
import bodyparser from 'koa-bodyparser';
import debuglog from 'debug';
import index from './routes/index';
import recent from './routes/recent';
import search from './routes/search';
import share from './routes/share';
import itunesProxy from './routes/itunes-proxy';
import errorHandler from './lib/error-handler';

const debug = debuglog('match.audio');

process.env.VUE_ENV = 'server';

const app = koa();

app.use(errorHandler());

app.use(bodyparser());
app.use(cors());
app.use(compress({ flush: zlib.Z_SYNC_FLUSH }));
app.use(favicon(path.join(__dirname, '/public/images/favicon.png')));
app.use(logger());
app.use(serve('public', { maxage: 31536000000 }));

app.use(views(path.resolve(__dirname, './views'), {
  map: {
    html: 'ejs',
  },
}));

app.use(route.get('/', index));
app.use(route.get('/recent', recent));
app.use(route.post('/search', search));
app.use(route.get('/:service/:type/:id.:format?', share));
app.use(route.get('/itunes/(.*)', itunesProxy));

if (!module.parent) {
  app.listen(process.env.PORT || 3000, () => {
    debug(`Koa HTTP server listening on port ${(process.env.PORT || 3000)}`);
  });
}

export default app;
