$(function() {
    //全局参数查询对象
    var queryObj = {
        proName: "",
        brandId: "",
        price: "",
        num: "",
        page: "",
        pageSize: 2
    };
    queryObj.proName = getURLParams("key");


    var Count = 1;
    mui.init({
        pullRefresh: {
            container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                height: 50, //可选,默认50.触发下拉刷新拖动距离,
                auto: true, //可选,默认false.首次加载自动下拉刷新一次
                contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback: function() {
                    setTimeout(function() {
                        queryObj.page = 1;
                        queryProduct(function(result) {
                            Count = result.count;
                            var html = template("prolistTpl", result);
                            $(".madam_xie").html(html);

                            //结束下拉刷新
                            mui('#refreshContainer').pullRefresh().endPulldownToRefresh(false);
                            //重置下拉控件
                            mui('#refreshContainer').pullRefresh().refresh(true);
                        })

                    }, 1000);

                }
            },
            up: {

                height: 50, //可选.默认50.触发上拉加载拖动距离
                auto: true, //可选,默认false.自动上拉加载一次
                contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
                callback: function() {
                        var totalPage = Math.ceil(Count / queryObj.pageSize);
                        setTimeout(function() {
                            if (queryObj.page < totalPage) {
                                //继续请求数据
                                queryObj.page++;
                                queryProduct(function(result) {
                                    var html = template("prolistTpl", result);
                                    $(".madam_xie").append(html);
                                    mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);

                                })
                            }

                            mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);

                        }, 1000);
                    } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });

    //发送请求
    function queryProduct(callback) {
        $.ajax({
            url: "/product/queryProduct",
            data: queryObj,

            success: function(result) {
                // console.log(result);

                callback && callback(result);
            }
        })
    }
    //获取url上的参数
    function getURLParams(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    $(".searchBtn").on("tap", function() {
        var val = $(".searchTxt").val();

        if (!$.trim(val)) {
            // 用户提示 请输入关键字
            mui.toast("请输入关键字");
        } else {
            queryObj.proName = val;
            mui("#refreshContainer").pullRefresh().pulldownLoading();



        }
    })
})