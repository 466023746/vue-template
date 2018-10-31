<#if !cdnBaseUrl??><#include "./mock.ftl"></#if>
<#include "/common.ftl">
<#include "/macro.ftl">
<#import "/function.ftl" as cof>
<#escape x as x?html>
<!DOCTYPE html>
<html>
<head>
    <@meta/>
    <@title addSiteName=false text="网易考拉种草社区"/>
    <@commonHead/>
</head>
<body>

<div id="app"></div>

<@footerWidget/>
<@ga/>

<#noescape>

<@commonScript/>
<@shareScript shareTitle="" shareDesc=""/>

</#noescape>

</body>
</html>
</#escape>
