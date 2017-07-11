require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')  //文件路径操作方法
var express = require('express') //nodejs框架，启动一个webserver
var webpack = require('webpack') //引入nodejs进行编译
var proxyMiddleware = require('http-proxy-middleware') //代理中间件，转发api
var webpackConfig = require('./webpack.dev.conf') //webpack 相关配置

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()

/*本地json请求方式*/
var appData = require('../data.json');
var goodsDetails = appData.goodsDetails;
var goodsOrder = appData.goodsOrder;
var goodsOrderList = appData.goodsOrderList;
var goodsIndex = appData.goodsIndex;
var marketDetail = appData.marketDetail;
var myPublished = appData.myPublished;
var published_detail = appData.published_detail;
var qj_index = appData.qj_index;
var area_index = appData.area_index;
var area_detail = appData.area_detail;
var myCardList = appData.myCardList;
var club_order_list = appData.club_order_list;
var my_vip = appData.my_vip;
var club_order_detail = appData.club_order_detail;
var area_choose_date = appData.area_choose_date;
var area_choose_area = appData.area_choose_area;
var area_choose_time = appData.area_choose_time;
var area_evaluate = appData.area_evaluate;
var door_list = appData.door_list;
var tenant_list = appData.tenant_list;
var my_code = appData.my_code;
var code_share = appData.code_share;
var family_list = appData.family_list;
var service_detail = appData.service_detail;
var wb_detail = appData.wb_detail;
var wb_order_detail = appData.wb_order_detail;
var wb_reserve = appData.wb_reserve;
var wb_bj = appData.wb_bj;
var wb_order_list = appData.wb_order_list;
var my_paylist = appData.my_paylist;
var wallet_record = appData.wallet_record;
var wallet_code = appData.wallet_code;
var getVillage = appData.getVillage;
var myinfo = appData.myinfo;
var user_info = appData.user_info;
var myhouse = appData.myhouse;
var devicelist = appData.devicelist;
var houseinfo = appData.houseinfo;
var rent = appData.rent;
var trust = appData.trust;
var newsIndex = appData.newsIndex;
var notice_list = appData.notice_list;
var notice_detail = appData.notice_detail;
var my_service = appData.my_service;
var enroll = appData.enroll;

var apiRoutes = express.Router();
apiRoutes.get('/goodsDetails',function(req,res){
  res.json({
    errno:0,
    data:goodsDetails
  })
});

apiRoutes.get('/goodsOrder',function(req,res){
  res.json({
    errno:0,
    data:goodsOrder
  })
});

apiRoutes.get('/goodsOrderList',function(req,res){
  res.json({
    errno:0,
    data:goodsOrderList
  })
});
apiRoutes.get('/goodsIndex',function(req,res){
  res.json({
    errno:0,
    data:goodsIndex
  })
});
apiRoutes.get('/marketDetail',function(req,res){
  res.json({
    errno:0,
    data:marketDetail
  })
});
apiRoutes.get('/myPublished',function(req,res){
  res.json({
    errno:0,
    data:myPublished
  })
});
apiRoutes.get('/published_detail',function(req,res){
  res.json({
    errno:0,
    data:published_detail
  })
});
apiRoutes.get('/qj_index',function(req,res){
  res.json({
    errno:0,
    data:qj_index
  })
});apiRoutes.get('/area_index',function(req,res){
  res.json({
    errno:0,
    data:area_index
  })
});apiRoutes.get('/area_detail',function(req,res){
  res.json({
    errno:0,
    data:area_detail
  })
});apiRoutes.get('/club_order_list',function(req,res){
  res.json({
    errno:0,
    data:club_order_list
  })
});apiRoutes.get('/my_vip',function(req,res){
  res.json({
    errno:0,
    data:my_vip
  })
});
apiRoutes.get('/club_order_detail',function(req,res){
  res.json({
    errno:0,
    data:club_order_detail
  })
});apiRoutes.get('/area_choose_time',function(req,res){
  res.json({
    errno:0,
    data:area_choose_time
  })
});apiRoutes.get('/area_choose_area',function(req,res){
  res.json({
    errno:0,
    data:area_choose_area
  })
});apiRoutes.get('/myCardList',function(req,res){
  res.json({
    errno:0,
    data:myCardList
  })
});apiRoutes.get('/area_choose_date',function(req,res){
  res.json({
    errno:0,
    data:area_choose_date
  })
});
apiRoutes.get('/area_evaluate',function(req,res){
  res.json({
    errno:0,
    data:area_evaluate
  })
});
apiRoutes.get('/door_list',function(req,res){
  res.json({
    errno:0,
    data:door_list
  })
});
apiRoutes.get('/tenant_list',function(req,res){
  res.json({
    errno:0,
    data:tenant_list
  })
});
apiRoutes.get('/family_list',function(req,res){
  res.json({
    errno:0,
    data:family_list
  })
});
apiRoutes.get('/service_detail',function(req,res){
  res.json({
    errno:0,
    data:service_detail
  })
});
apiRoutes.get('/wb_detail',function(req,res){
  res.json({
    errno:0,
    data:wb_detail
  })
});
apiRoutes.get('/wb_order_detail',function(req,res){
  res.json({
    errno:0,
    data:wb_order_detail
  })
});
apiRoutes.get('/wb_reserve',function(req,res){
  res.json({
    errno:0,
    data:wb_reserve
  })
});
apiRoutes.get('/wb_bj',function(req,res){
  res.json({
    errno:0,
    data:wb_bj
  })
});
apiRoutes.get('/wb_order_list',function(req,res){
  res.json({
    errno:0,
    data:wb_order_list
  })
});
apiRoutes.get('/my_code',function(req,res){
  res.json({
    errno:0,
    data:my_code
  })
});
apiRoutes.get('/code_share',function(req,res){
  res.json({
    errno:0,
    data:code_share
  })
});
apiRoutes.get('/my_paylist',function(req,res){
  res.json({
    errno:0,
    data:my_paylist
  })
});
apiRoutes.get('/wallet_record',function(req,res){
  res.json({
    errno:0,
    data:wallet_record
  })
});
apiRoutes.get('/wallet_code',function(req,res){
  res.json({
    errno:0,
    data:wallet_code
  })
});
apiRoutes.get('/getVillage',function(req,res){
  res.json({
    errno:0,
    data:getVillage
  })
});
apiRoutes.get('/myinfo',function(req,res){
  res.json({
    errno:0,
    data:myinfo
  })
});
apiRoutes.get('/user_info',function(req,res){
  res.json({
    errno:0,
    data:user_info
  })
});
apiRoutes.get('/myhouse',function(req,res){
  res.json({
    errno:0,
    data:myhouse
  })
});
apiRoutes.get('/devicelist',function(req,res){
  res.json({
    errno:0,
    data:devicelist
  })
});
apiRoutes.get('/houseinfo',function(req,res){
  res.json({
    errno:0,
    data:houseinfo
  })
});
apiRoutes.get('/rent',function(req,res){
  res.json({
    errno:0,
    data:rent
  })
});
apiRoutes.get('/trust',function(req,res){
  res.json({
    errno:0,
    data:trust
  })
});
apiRoutes.get('/newsIndex',function(req,res){
  res.json({
    errno:0,
    data:newsIndex
  })
});
apiRoutes.get('/notice_list',function(req,res){
  res.json({
    errno:0,
    data:notice_list
  })
});
apiRoutes.get('/notice_detail',function(req,res){
  res.json({
    errno:0,
    data:notice_detail
  })
});
apiRoutes.get('/my_service',function(req,res){
  res.json({
    errno:0,
    data:my_service
  })
});
apiRoutes.get('/enroll',function(req,res){
  res.json({
    errno:0,
    data:enroll
  })
});
app.use('/api',apiRoutes);



var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
