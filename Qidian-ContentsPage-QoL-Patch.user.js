// ==UserScript==
// @name         起点目录页Qol补丁
// @namespace    https://github.com/letterk/UserScript
// @author       letterk
// @version      0.1.1
// @description  计算日均更新字数
// @match        https://www.qidian.com/book/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    // 获取页面中所有 class 属性为 "chapter-name" 的元素
    const chapterElements = document.getElementsByClassName("chapter-name");

    // 初始化最早和最晚的日期
    let earliestDate = new Date();
    let latestDate = new Date(0);
    // 初始化总字数为 0
    let totalWordCount = 0;

    // 遍历所有章节元素
    for (let i = 0; i < chapterElements.length; i++) {
        // 获取当前章节的标题
        const chapterTitle = chapterElements[i].getAttribute("title");

        // 从标题中提取发布日期
        const chapterTime = extractChapterTime(chapterTitle);
        // 如果成功提取到日期
        if (chapterTime) {
            // 如果该日期早于当前的最早日期，则更新最早日期
            if (chapterTime < earliestDate.getTime()) {
                earliestDate = new Date(chapterTime);
            }
            // 如果该日期晚于当前的最晚日期，则更新最晚日期
            if (chapterTime > latestDate.getTime()) {
                latestDate = new Date(chapterTime);
            }
        }

        // 从标题中提取字数
        const chapterWordCount = extractWordCount(chapterTitle);
        // 如果成功提取到字数
        if (chapterWordCount) {
            // 将字数加入到总字数
            totalWordCount += chapterWordCount;
        }
    }

    // 计算时间差，单位为天
    const timeDiff = Math.max((latestDate - earliestDate) / (1000 * 3600 * 24), 0);
    // 计算平均每天的字数
    const averageWordCount = totalWordCount / timeDiff;

    // 找到页面中 class 属性为 "intro" 的元素
    const introElement = document.querySelector("p.intro");

    // 如果找到了该元素
    if (introElement) {
        // 计算连载天数（向上取整）和平均每天字数（四舍五入）
        const days = Math.ceil(timeDiff);
        const dailyWordCount = Math.round(averageWordCount);

        // 修改元素的文本内容
        introElement.innerHTML = `连载${days}天　日均字数：${dailyWordCount}`;
        // 修改元素的字体颜色
        introElement.style.color = "#000";
    }

    // 该函数用于从章节标题中提取首发时间
    function extractChapterTime(title) {
        // 定义匹配首发时间的正则表达式
        const pattern = /首发时间：(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/;
        // 使用正则表达式匹配标题
        const match = pattern.exec(title);

        // 如果匹配成功
        if (match && match.length > 1) {
            // 获取匹配到的日期时间字符串
            const dateTimeString = match[1];
            // 将日期时间字符串转换为 Date 对象
            const dateObj = new Date(dateTimeString);
            // 返回该日期的毫秒数（自 1970 年 1 月 1 日 00:00:00 UTC 开始）
            return dateObj.getTime();
        }

        // 如果匹配失败，返回 null
        return null;
    }

    // 该函数用于从章节标题中提取字数
    function extractWordCount(title) {
        // 定义匹配字数的正则表达式
        const pattern = /章节字数：(\d+)/;
        // 使用正则表达式匹配标题
        const match = pattern.exec(title);

        // 如果匹配成功
        if (match && match.length > 1) {
            // 返回匹配到的字数（转换为整数）
            return parseInt(match[1]);
        }

        // 如果匹配失败，返回 null
        return null;
    }

})();
