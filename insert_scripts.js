'use strict';

try {
    chrome.extension.onMessage.addListener(function (request, _, response) {
        // console.log(request);
        switch(request.contextMenuId){
            case "fillBlanks":fillBlanks();break;
            case "showAnswer":showAnswer();break;
            case "addSpeed15x":addSpeed15x();break;
            case "fillChoice":fillChoice();break;
            case "fillJudge":fillJudge();break;
            case "autoVideo":autoVideo();break;
        }
        response({farewell: "ok"});
    });
} catch (error) {
    alert("插件加载失败\n原因：" + error);
}
function removeDuplicatedItem(arr) {
   for(var i = 0; i < arr.length-1; i++){
       for(var j = i+1; j < arr.length; j++){
           if(arr[i]==arr[j]){
              arr.splice(j,1);
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
    $('.blank-input').each(function (k, v) {
        var id = $(v).parent().parent().parent().parent().parent().parent().parent().attr('id');
        if(!id)
        {
            id = $(v).parent().parent().parent().parent().parent().parent().parent().parent().attr('id');
        }
        if (!id) 
        {
            id = $(v).parent().parent().parent().parent().parent().parent().parent().parent().parent().attr('id');
        }
        id = id.replace('question', '');
        idList.push(id);
    });
    idList = removeDuplicatedItem(idList);
    $(idList).each(function (k, id) {
        $.ajax({
            async: false,
            type: "get",
            url: 'https://api.ulearning.cn/questionAnswer/' + id,
            datatype: 'json',
            success: function (result) {
                re.push(result.correctAnswerList);
            }
        });
    });
    $(re).each(function (k1, v1) {
        if (v1.length == 1) {
            ansarr.push(v1[0]);
        } else {
            $(v1).each(function (k2, v2) {
                ansarr.push(v2);
            });
        }
    });
    console.log(ansarr);
    $('.blank-input').each(function (k, v) {
        console.log(v);
        $(v).val(ansarr.shift());
    });
}

// function end() {
//     console.log('视频播放结束');
//     clearTimeout(timer);
//     $('.btn-tip')[1].click();
//     var timer = setTimeout(function() {
//             if ($('.mejs__overlay-button').length == 0) {
//                 console.log('test');
//                 clearTimeout(t);
//                 $('.next-page-btn').children(0)[0].click();
//                 var t = setTimeout(function() {
//                     if ($('.modal-operation')[0].children.length >1) {
//                         $('.modal-operation')[0].children[1].click();
//                     }
//                     if ($('.stat-next').length != 0) {
//                         setTimeout(() => {
//                             $('.stat-next')[0].children[1].click();
//                             setTimeout(() => {
//                                 end();
//                             }, 1000);
//                         }, 1000);
//                     }
//                     setTimeout(() => {
//                         end();
//                     }, 1000);
//                 }, 1000)
//             } else {
//                 $('.mejs__overlay-button').click();
//                 setTimeout(function() {
//                 quickVideo(15);
//                 $('.custom-video')[1].onended = end;
//                 console.log('已为视频分配函数');
//                 }, 1000)

//             }

//     }, 1000)
// }

function autoVideo()
{
    console.log('视频播放结束');
    clearTimeout(timer);
    $('.btn-tip')[1].click();
    var timer = setTimeout(function() {
            if ($('.mejs__overlay-button').length == 0) {
                console.log('test');
                clearTimeout(t);
                $('.next-page-btn').children(0)[0].click();
                var t = setTimeout(function() {
                    if ($('.modal-operation')[0].children.length >1) {
                        $('.modal-operation')[0].children[1].click();
                    }
                    if ($('.stat-next').length != 0) {
                        setTimeout(() => {
                            $('.stat-next')[0].children[1].click();
                            setTimeout(() => {
                                end();
                            }, 1000);
                        }, 1000);
                    }
                    setTimeout(() => {
                        end();
                    }, 1000);
                }, 1000)
            } else {
                $('.mejs__overlay-button').click();
                setTimeout(function() {
                $('.custom-video')[1].onended = end;
                $('video').each(function(k,v){
                     v.playbackRate = 15;
                     console.log('视频速率为 '+'15'+' x');
                 });
                console.log('已为视频分配函数');
                }, 3000)
            }
    }, 1000)
}

function fillChoice()
{
	var sqList = [];
    var re = [];
    $('.question-wrapper').each(function (k, v) {
        var id = $(v).attr('id');
        $.ajax({
            async: false,
            type: "get",
            url: 'https://api.ulearning.cn/questionAnswer/' + id.replace('question', ''),
            datatype: 'json',
            success: function (result) {
                re.push(result.correctAnswerList);
            }
        });
    });
    console.log(re);
    $(re).each(function (k, v) {
        console.log(v);
        var choice_list = $($('.choice-list')[k]).find('div.checkbox');
        for (var i = v.length - 1; i >= 0; i--) {
        	switch(v[i]){
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
    $('.question-wrapper').each(function (k, v) {
        var id = $(v).attr('id');
        sqList.push(id.replace('question', ''));
    });
    //console.log(sqList);
    $(sqList).each(function (k, id) {
        $.ajax({
            async: false,
            type: "get",
            url: 'https://api.ulearning.cn/questionAnswer/' + id,
            datatype: 'json',
            success: function (result) {
                re.push(result.correctAnswerList);
            }
        });
    });
    //console.log(re);
    var an = [];
    $(re).each(function (k, v) {
        an.push(v.join(','));
    });
    var t = $('.question-wrapper').find('.question-title-html');
    t.each(function (k, v) {
        //console.log(v);
        $(v).after('<span style="color:red;">答案：' + an.shift() + '</span>');
    });
}

function addSpeed15x() {
	$('.mejs__speed-selector-input').each(function (k, v) {
		v.value=15.00;
	});
	$('.mejs__speed-selector-label').each(function(k,v){
		v.innerText = '15.00x';
	});
}

function fillJudge(){
    var sqList = [];
    var re = [];
    $('.show-answer').each(function (k, v) {
        var id = $(v).attr("id").replace(/[A-Za-z]+/,"")
        console.log(id)
        sqList.push(id)
    });
    
    $(sqList).each(function (k, id) {
        $.ajax({
            async: false,
            type: "get",
            url: 'https://api.ulearning.cn/questionAnswer/' + id,
            datatype: 'json',
            success: function (result) {
                re.push(result.correctAnswerList);
            }
        });
    });
    console.log(re);
    var an = [];
    $(re).each(function (k, v) {
            an.push(v.toString())
    });
    $('.checking-type').each(function(k,v){
        if(an.shift()=="true")
            $($(v).find(".right-btn")).trigger("click");    
        else
            $($(v).find(".wrong-btn")).trigger("click");    
    })
}
