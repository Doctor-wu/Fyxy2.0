'use strict';

var parents = chrome.contextMenus.create({ "title": "fuckYXY", "contexts": ["all"] });
chrome.contextMenus.create(
    { "title": "显示答案", "parentId": parents, "onclick": genericOnClick, id: 'showAnswer', "contexts": ["all"] });
chrome.contextMenus.create(
    { "title": "自动填充填空题答案", "parentId": parents, "onclick": genericOnClick, id: 'fillBlanks', "contexts": ["all"] });
chrome.contextMenus.create(
    { "title": "添加15倍速", "parentId": parents, "onclick": genericOnClick, id: 'addSpeed15x', "contexts": ["all"] });
chrome.contextMenus.create(
    { "title": "自动填充选择题", "parentId": parents, "onclick": genericOnClick, id: 'fillChoice', "contexts": ["all"] });
chrome.contextMenus.create(
    { "title": "自动填充判断题", "parentId": parents, "onclick": genericOnClick, id: 'fillJudge', "contexts": ["all"] });

function genericOnClick(info, tab) {
    // 获取活动中的tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // 向该tab发送消息
        chrome.tabs.sendMessage(tabs[0].id, { 'contextMenuId': info.menuItemId, 'info': info }, function (response) { });
    });
}