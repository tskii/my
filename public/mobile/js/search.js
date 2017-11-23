$(function() {

    loadHistory()

    function loadHistory() {
        var ls = localStorage;
        var arr = (ls.getItem("LT_his") && JSON.parse(ls.getItem("LT_his"))) || [];
        console.log(arr)
        if (arr.length < 1) {
            $(".record").html('');
            return;
        }
        var strArr = [];
        for (var index = 0; index < arr.length; index++) {
            strArr.push('<ul><li class="mui-clearfix"><span class="mui-pull-left">' + arr[index] + '</span> <span class = "item_close mui-icon mui-icon-closeempty mui-pull-right item_close" > </li></ul>');
        }
        // 渲染列表数据 
        $(".record").html(strArr.join(''));
    }

    $(".searchBtn").on("tap", function() {
            var val = $(".searchTxt").val();
            //去掉空格
            if (!$.trim(val)) {
                return false;
            }

            var ls = localStorage;
            var arr = (ls.getItem("LT_his") && JSON.parse(ls.getItem("LT_his"))) || [];

            //去重的处理
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == val) {
                    arr.splice(i, 1);
                }
            }

            arr.unshift(val);
            ls.setItem("LT_his", JSON.stringify(arr));
            // loadHistory()
            location.href = "searchList.html?key=" + val;
        })
        //清空
    $(".clearBtn").on("tap", function() {
        localStorage.setItem("LT_his", JSON.stringify([]))
        loadHistory();
    })

    //事件委托
    $("body").on("tap", ".item_close", function() {
        var index = $(this).parent().index();
        var ls = localStorage;
        var arr = (ls.getItem("LT_his") && JSON.parse(ls.getItem("LT_his"))) || [];
        arr.splice(index, 1);
        ls.setItem("LT_his", JSON.stringify(arr));
        loadHistory();
    })
})