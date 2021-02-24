// WS

var wsurl = 'wss://keyserver.nwl.im:2001';
var json;
if ($.cookie('ws_dis') == null) {
    $.cookie('ws_dis', '0', { expires: 365000, path: '/' });
    var ws_dis = $.cookie('ws_dis');
}
var wsdis = $.cookie('ws_dis');

function ws_dis() {
    $.cookie('ws_dis', '1', { expires: 365000, path: '/' });
    console.log('设置成功，刷新页面以生效设置。如果要重新开启，输入ws_en()');
}

function ws_en() {
    $.cookie('ws_dis', '0', { expires: 365000, path: '/' });
    console.log('设置成功，刷新页面以生效设置。如果要关闭，输入ws_dis()');
}

function auto_send() {
    var Inter1 = setInterval(function() {
        var wjson = {
            "action": "view",
            "title": document.title,
            "domain": document.domain,
            "url": window.location.href
        }
        stringSend(wjson);
    }, 5000);
}

if (wsdis == 0) {
    console.log('数据统计已开启。该数据统计只会统计本站，不会涉及到您的隐私。');

    function stringSend(wjson) {
        ws.send(JSON.stringify(wjson));
    }
    ws = new WebSocket(wsurl);

    ws.onopen = function() {
        console.log('连接成功，正在分配客户端ID...');
        var wsjson = {
            "action": "try",
            "msg": "try"
        }
        stringSend(wsjson);
        auto_send();
    };
    ws.onmessage = function(e) {
        json = JSON.parse(e.data);
        switch (json.status) {
            case 101:
                // 分配ID
                $('#topsitelink').text($('#topsitelink').text() + '#' + json.msg);
                break;

            case 102:
                // 刷新
                location.reload();
                break;

            case 103:
                // 前往站内页面
                var protocol = window.location.protocol;
                var domain = window.location.host;
                var page = json.msg;
                window.location.replace(protocol + '//' + domain + '/' + page);
                break;

            case 104:
                // 前往任何页面
                var page = json.msg;
                window.location.replace(page);
                break;

            case 105:
                // 通知
                alert(json.msg);
                break;

            case "online":
                // 在线会话数量
                $('#online').text(json.msg);
                break;

            default:

                break;
        }
    };

    ws.onerror = function(e) {
        console.log('连接错误。');
    }

    ws.onclose = function(e) {
        console.log('连接被关闭。');
    }
} else {
    console.log('将不会发送和接收任何数据。');
}
