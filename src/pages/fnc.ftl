<#function waterMask url image="MzJhYzFlY2UtYWJiYS00ODFhLWJlY2QtNjQ2ODJlMWUyOGVkLnBuZw%3D%3D&%7C">
<#if url == ''>
<#return ''>
</#if>
<#--  去除参数  -->
<#local newurl = url?split('?')[0] />
<#local paramstr = '?imageView&thumbnail=198y198&enlarge=1%7Cwatermark&type=1&dx=0&dy=0&gravity=south&image=' />
<#local paramstr = paramstr + image>
<#return newurl + paramstr>
</#function>