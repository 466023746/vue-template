<#if !cdnBaseUrl??><#include "./mock.ftl"></#if>
<#include "/common.ftl">
<#include "/macro.ftl">
<#import "/function.ftl" as cof>
<#escape x as x?html>
<!DOCTYPE html>
<html>
<head>
    <@meta/>
    <@title addSiteName=false text="网易考拉种草任务"/>
    <@commonHead/>
</head>
<body>

<div id="app"></div>

<@footerWidget/>
<@ga/>

<#noescape>

<@commonScript/>
<@shareScript shareTitle="网易考拉-种草任务中心" shareDesc="网易考拉种草任务，达人持续招募中，寻找爱种草的“你”，可登陆考拉创作平台寻找更多任务～"/>

</#noescape>

</body>
</html>
</#escape>
