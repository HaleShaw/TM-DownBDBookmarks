// ==UserScript==
// @name                下载百度书签
// @name:zh-CN          下载百度书签
// @name:en             Download BaiDu bookmarks
// @description         下载百度书签。
// @description:zh-CN   下载百度书签。
// @description:en      Download bookmarks of Baidu.
// @namespace           https://greasyfork.org/zh-CN/users/331591
// @version             1.0.0
// @author              Hale Shaw
// @homepage            https://greasyfork.org/zh-CN/scripts/391482
// @supportURL          https://greasyfork.org/zh-CN/scripts/391482/feedback
// @icon                https://www.baidu.com/favicon.ico
// @require             https://greasyfork.org/scripts/398010-commonutils/code/CommonUtils.js?version=781197
// @match               https://www.baidu.com
// @match               https://www.baidu.com/
// @match               http://www.baidu.com
// @match               http://www.baidu.com/
// @license             AGPL-3.0-or-later
// @compatible	        Chrome
// @run-at              document-idle
// @grant               none
// ==/UserScript==

(function () {
  'use strict';

  if (isValidByClassName("name-text")) {
    var result = getBaiDuBookmarks();

    var date = new Date();
    var month = date.getMonth() + 1;
    var fileName = "bookmarks_" + date.getFullYear() + month + date.getDate() + ".json"
    downloadFile(result, fileName);
  }
  else {
    console.warn("No bookmarks! Please make sure you are logged in and have bookmarks.");
  }

  /**
   * 获取百度首页中“我的关注-我的导航”中的收藏夹
   */
  function getBaiDuBookmarks() {
    var titles = document.getElementsByClassName("name-text");
    var linkParents = document.getElementsByClassName("dir-content s-opacity-blank3");
    var result = new Object;
    var bookmarks = [];
    for (var i = 0; i < titles.length; i++) {
      var links = linkParents[i].children;
      if (links.length != 0) {
        var category = titles[i].firstChild.textContent;
        var list = [];
        for (var j = 0; j < links.length; j++) {
          var link = new Object;
          link.title = links[j].children[0].getAttribute("title");
          link.url = links[j].children[0].href;
          link.img = links[j].children[0].children[1].getAttribute("src");
          list[j] = link;
        }

        var bookmark = new Object;
        bookmark.category = category;
        bookmark.list = list;
        bookmarks[i] = bookmark;
      }
    }
    result.bookmarks = bookmarks;
    return result;
  }

  /**
   * 将对象数据根据文件名下载到本地
   * @param {Object} obj 需要下载的JSON对象
   * @param {String} fileName 下载时的文件名
   */
  function downloadFile(obj, fileName) {
    // 创建a标签
    var elementA = document.createElement('a');
    elementA.download = fileName;
    elementA.style.display = 'none';

    //生成一个blob二进制数据，内容为json数据
    var blob = new Blob([JSON.stringify(obj)]);

    //生成一个指向blob的URL地址，并赋值给a标签的href属性
    elementA.href = URL.createObjectURL(blob);
    document.body.appendChild(elementA);
    elementA.click();
    document.body.removeChild(elementA);
  }
})();
