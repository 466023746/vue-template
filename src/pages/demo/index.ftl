<#if !cdnBaseUrl??><#include "/demo/mock.ftl"></#if>
<#include "/common.ftl">
<#include "/macro.ftl">
<#import "/function.ftl" as cof>
<#escape x as x?html>
<!DOCTYPE html>
<html>
<head>
    <@meta/>
    <@title addSiteName=false text="demo"/>
    <@commonHead/>
</head>
<body>

<div id="app"></div>

<@footerWidget/>
<@ga/>

<#noescape>

<@commonScript/>
<@shareScript shareTitle="demo" shareDesc="this is demo share"/>

</#noescape>

</body>
</html>
</#escape>
