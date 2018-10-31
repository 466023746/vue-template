<#import "/function.ftl" as cof>
<#import "/fnc.ftl" as fnc>

<#macro commonScript>
<script src="https://hubble-js-bucket.nosdn.127.net/DATracker.sync.1.6.7.js"></script>
<script>
    var code = ${code!0};
    var msg = "${msg!''}";

    var pageData = ${cof.stringify(pageData!{})};
</script>
</#macro>

<#macro shareScript shareTitle
                    shareDesc
                    sharePic="http://haitao.nos.netease.com/20fec26a-977d-499f-b557-f4641934828b.png">
<script>
    var link = location.href;
    var title = "${shareTitle!''}";
    var desc = "${shareDesc!''}";

    window.shareConfig = {
        img_url: "${fnc.waterMask(sharePic)}",
        link: link,
        title: title,
        desc: desc,
        wbpost: title + desc.substring(0,10) + '。。。' + link,
        timeLineTitle: title
    };
</script>
</#macro>

<#macro commonHead>
<link rel="stylesheet" href="//haitao.nos.netease.com/55de737a-d11d-4477-9974-e049c15ec2b4.css">
<style>
    @font-face {
        font-family: 'sqfont';  /* project id 423306 */
        src: url('//haitao.nos.netease.com/97e2241d-4ba4-4a54-baae-f04ce4734354.eot');
        src: url('//haitao.nos.netease.com/97e2241d-4ba4-4a54-baae-f04ce4734354.eot?#iefix') format('embedded-opentype'),
        url('//haitao.nos.netease.com/475ef4e9-6de7-4cc6-8560-f48010aaa027.woff') format('woff'),
        url('//haitao.nos.netease.com/a124024b-5eda-41bc-8863-8526a528f135.ttf') format('truetype'),
        url('//haitao.nos.netease.com/f6e0bb36-4ecb-4c71-9401-150d9864122f.svg#sqfont') format('svg');
    }

    .sqfont {
        font-family: 'sqfont' !important;
        font-size: 14px;
        speak: none;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        vertical-align: baseline;
        display: inline-block;

        /* Better Font Rendering =========== */
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
</style>
</#macro>
