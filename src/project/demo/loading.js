/**
 * Created by yq_ch on 2017/6/14.
 */
/*加载提示模块*/

define(['jquery'], function($) {
  var loadingContent = '<div id="loadingBg"></div><div id="loadingContainer" class="text-center"><div class="sk-spinner sk-spinner-three-bounce"><div class="sk-bounce1"></div><div class="sk-bounce2"></div><div class="sk-bounce3"></div></div></div>',
    initialized = false,
    isShow = false,
    isTipShow = false,
    loadingContainer,
    loadingBg,
    tipsContainer,
    tipsTimer;

  //确认框相关

  var initializedConfirm = false,
    confirmContainer;

  //初始化确认框
  var initConfirm = function() {
    if(!initializedConfirm) {
      initializedConfirm = true;
      $(document.body).append('<div id="loadingBg"></div><div id="confirmContainer" class="text-center"><div class="title">title</div><div class="content">content</div><div class="buttons"><button class="btn btn-success">确认</button><button class="btn btn-cancel">取消</button></div></div>');
      loadingBg = $("#loadingBg");
      confirmContainer = $("#confirmContainer");
    } else {
      confirmContainer.find('.btn-success').unbind('click');
      confirmContainer.find('.btn-cancel').unbind('click');
      loadingBg.show();
      confirmContainer.show();
    }
  };

  return {
    initLoading : function() {
      if(!initialized) {
        initialized = true;
        $(document.body).append(loadingContent);
        loadingContainer = $("#loadingContainer");
        loadingBg = $("#loadingBg");
      }
    },

    //显示loading
    showLoading : function() {
      this.initLoading();
      if(!isShow) {
        isShow = true;
        loadingContainer.show();
        loadingBg.show();
      }
    },
    //隐藏loading
    hideLoading : function() {
      if(isShow) {
        isShow = false;
        loadingContainer.hide();
        loadingBg.hide();
      }
    },

    /**
     * 确认提示
     * @param title 提示框title
     * @param textcontent 提示内容
     * @param okCallbackFun 确认回调
     * @param cancelCallbackFun 取消回调
     **/
    showConfirm : function(title, textcontent, okCallbackFun, cancelCallbackFun) {
      initConfirm();
      confirmContainer.find('.title').text(title);
      confirmContainer.find('.content').text(textcontent);
      confirmContainer.find('.btn-success').click(function() {
        confirmContainer.hide();
        loadingBg.hide();
        okCallbackFun();
      });
      confirmContainer.find('.btn-cancel').click(function() {
        confirmContainer.hide();
        loadingBg.hide();
        cancelCallbackFun();
      });
    },

    //取消确认框
    hideConfirm: function() {
      confirmContainer.hide();
      loadingBg.hide();
    },

    //提示
    showToasts : function(text) {
      window.clearTimeout(tipsTimer);
      this.removeToasts();
      $(document.body).append('<div id="tipsContainer">' + text + '</div>');
      isTipShow = true;
      tipsContainer = $("#tipsContainer");
      tipsContainer.css('left',
        ( $(document).width() - parseFloat(tipsContainer.width()) - 120 ) / 2);
      tipsContainer.css('top',
        ( $(window).height() - parseFloat(tipsContainer.height()) ) / 2);

      tipsTimer = window.setTimeout(this.removeToasts, 3000);
    },

    removeToasts : function() {
      if(isTipShow) {
        isTipShow = false;
        tipsContainer.remove();
      }
    }
  };
});
