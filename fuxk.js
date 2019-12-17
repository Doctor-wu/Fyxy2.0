// $('.mejs__overlay-button')  开始播放按钮
// $('.btn-tip')[1]   下一页
// $('.custom-video')[1] vedio标签
//$('.mejs__overlay-play') 
//$('.mejs__overlay-button')

/*
    视频结束跳转下一页
    下一页三种情况
    1
        视频（可能是数组)
    2
        测试(分题型)
    3
        文章/ppt
*/
timer = {};

function end() {
    $('.btn-tip')[1].click();
    var video_count = 0;
    // console.log('视频播放结束');
    for (let name in timer) {
        clearTimeout(timer[name])
    }
    timer['timer1'] = setTimeout(function() {
        if ($('.mejs__overlay-button').length == 0 && $('.file-media').length == 0) {
            //没有播放按钮就是测试或者文章
            if ($('.question-type-tag').length == 0) { //文章
                console.log('artical');
                timer['timer2'] = setTimeout(() => {
                    end();
                    return;
                }, 1500)
            } else { //测试
                console.log('test');
                switch ($('.question-type-tag')[0].innerHTML) {
                    case "单选题":
                        fillChoice();
                        break;
                    case "多选题":
                        fillChoice();
                        break;
                    case "填空题":
                        fillBlanks();
                        break;
                    case "判断题":
                        fillJudge();
                        break;
                    default:
                        break;
                }
                timer['timer3'] = setTimeout(function() {
                    $('.question-operation-area')[0].children[0].click();
                    timer['timer4'] = setTimeout(function() {
                        if ($('.stat-next').length != 0) { //离开本章
                            timer['timer5'] = setTimeout(() => {
                                console.log('重新装载end');
                                end();
                                return;
                            }, 2000)
                        } else {
                            timer['timer6'] = setTimeout(() => {
                                console.log('重新装载end');
                                end();
                                return;
                            }, 2000)
                        }
                    }, 1500)
                }, 3000)
            }

        } else {
            Array.from($('.mejs__overlay-button')).forEach(item => item.click());
            timer['timer8'] = setTimeout(function() { //等待两秒，稍安勿躁
                Array.from($('.custom-video')).forEach(item => {
                    if (item instanceof HTMLVideoElement) {
                        video_count++;
                        quickVideo(15);
                    }

                })
                console.log('已为视频分配函数');
                timer['timer7'] = setTimeout(function() {
                    Array.from($('.custom-video')).forEach(item => {
                        if (item instanceof HTMLVideoElement) {
                            item.onended = function() {
                                video_count--;
                                if (video_count == 0) {
                                    end();
                                    return;
                                }
                            }
                        }
                    })
                }, 0)

            }, 2000);

        }

    }, 1000)

} //不用担心定时器的问题，他们都在事件队列中好着呢

function removeDuplicatedItem(arr) { //去掉重复的id
    for (var i = 0; i < arr.length - 1; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            if (arr[i] == arr[j]) {
                arr.splice(j, 1);
                j--;
            }
        }
    }
    return arr;
}

function fillBlanks() {
    var ansarr = [];
    var idList = [];
    var re = [];
    $('.blank-input').each(function(k, v) {
        var id = $($(v).parents('.question-wrapper')[0]).attr('id');
        console.log(id);
        id = id.replace('question', '');
        idList.push(id);
    });
    idList = removeDuplicatedItem(idList);
    $(idList).each(function(k, id) {
        $.ajax({
            async: false,
            type: "get",
            url: 'https://api.ulearning.cn/questionAnswer/' + id,
            datatype: 'json',
            success: function(result) {
                re.push(result.correctAnswerList);
            }
        });
    });

    $(re).each(function(k1, v1) {
        if (v1.length == 1) {
            ansarr.push(v1[0]);
        } else {
            $(v1).each(function(k2, v2) {
                ansarr.push(v2);
            });
        }
    });
    console.log(ansarr);
    $('.blank-input').each(function(k, v) {
        console.log(v);
        $(v).val(ansarr.shift());
    });
}

function fillChoice() {
    var sqList = [];
    var re = [];
    $('.question-wrapper').each(function(k, v) {
        var id = $(v).attr('id');
        $.ajax({
            async: false,
            type: "get",
            url: 'https://api.ulearning.cn/questionAnswer/' + id.replace('question', ''),
            datatype: 'json',
            success: function(result) {
                re.push(result.correctAnswerList);
            }
        });
    });
    console.log(re);
    //console.log(sqList);
    $(re).each(function(k, v) {
        // console.log($('.choice-list')[k]);
        console.log(v);
        var choice_list = $($('.choice-list')[k]).find('div.checkbox');
        for (var i = v.length - 1; i >= 0; i--) {
            switch (v[i]) {
                case 'A':
                    $(choice_list[0]).trigger("click");
                    break;
                case 'B':
                    $(choice_list[1]).trigger("click");
                    break;
                case 'C':
                    $(choice_list[2]).trigger("click");
                    break;
                case 'D':
                    $(choice_list[3]).trigger("click");
                    break;
                case 'E':
                    $(choice_list[4]).trigger("click");
                    break;
                case 'F':
                    $(choice_list[5]).trigger("click");
                    break;
                case 'G':
                    $(choice_list[6]).trigger("click");
                    break;
                default:
                    break;
            }
        }
        console.log($($('.choice-list')[k]).find('div.checkbox'));
    });



}

function showAnswer() {
    var sqList = [];
    var re = [];
    $('.question-wrapper').each(function(k, v) {
        var id = $(v).attr('id');
        sqList.push(id.replace('question', ''));
    });
    //console.log(sqList);
    $(sqList).each(function(k, id) {
        $.ajax({
            async: false,
            type: "get",
            url: 'https://api.ulearning.cn/questionAnswer/' + id,
            datatype: 'json',
            success: function(result) {
                re.push(result.correctAnswerList);
            }
        });
    });
    //console.log(re);
    var an = [];
    $(re).each(function(k, v) {
        an.push(v.join(','));
    });
    var t = $('.question-wrapper').find('.question-title-html');
    t.each(function(k, v) {
        //console.log(v);
        $(v).after('<span style="color:red;">答案：' + an.shift() + '</span>');
    });
}

function quickVideo(speed = 2) {
    $('video').each(function(k, v) {
        v.playbackRate = speed;
        console.log('视频速率为 ' + speed + ' x');
    });
}

function fillJudge() {
    var sqList = [];
    var re = [];
    $('.show-answer').each(function(k, v) {
        var id = $(v).attr("id").replace(/[A-Za-z]+/, "")
        console.log(id)
        sqList.push(id)
    });

    $(sqList).each(function(k, id) {
        $.ajax({
            async: false,
            type: "get",
            url: 'https://api.ulearning.cn/questionAnswer/' + id,
            datatype: 'json',
            success: function(result) {
                re.push(result.correctAnswerList);
            }
        });
    });
    console.log(re);
    var an = [];
    $(re).each(function(k, v) {
        an.push(v.toString())
    });
    $('.checking-type').each(function(k, v) {
        if (an.shift() == "true")
            $($(v).find(".right-btn")).trigger("click");
        else
            $($(v).find(".wrong-btn")).trigger("click");
    })
}