###*
# 
# @date 2016-01-26 15:20:09
# @author vfasky <vfasky@gmail.com>
# @link http://vfasky.com
###
'use strict'

{EventEmitter, Template, util} = require 'mcore'
$ = require 'jquery'

each = util.each

# window
$win = $ window
# body
$body = $ 'body'

# 是否在微信中打开
_isWeixinBrowser = (/MicroMessenger/i).test(
    window.navigator.userAgent
)

# 是否在ios中打开
_isIOS = (/iphone|ipad/gi).test(
    window.navigator.appVersion
)

_id = 0

# 使用 jQuery 的事件，处理 Template 的事件绑定
Template::addEventListener = (event)->
    if !@refs
        @_initTask.push => @addEventListener event
        return
    if event not in @_eventReged
        @_eventReged.push event
        @_eventListener[event] = (e, args...)=>
            tasks = @_events[event]
            res = null
            util.each tasks, (task)=>
                if task.el == e.target
                    args or= []
                    args.splice 0, 0, e
                    args.splice 0, 0, task.el
                    #console.log arguments
                    #console.log @ if !@_proxy
                    if @_proxy and util.isFunction @_proxy[task.callback]
                        res = @_proxy[task.callback].apply @_proxy, args

                    else if util.isFunction task.callback
                        res = task.callback.apply @, args

                    else if util.isFunction @[task.callback]
                        res = @[task.callback].apply @, args

                    else
                        throw new Error 'not callback : ' + task.callback

                    return false
                    
            res

        $(@refs).on event, =>
            return @_eventListener[event].apply @, arguments


Template::removeEvent = (event, el, id)->
    return if !@refs

    event = event.toLowerCase()
    return if false == @_events.hasOwnProperty(event)

    util.each @_events[event], (e, i)=>
        if e.id == id
            @_events[event].splice i, 1
            return false

    # 移除事件
    if @_events[event].length == 0
        $(@refs).off event
        



loadPromise = (data)->
    dtd = $.Deferred()
    keys = util.objectKeys data

    if keys.length == 0
        dtd.resolve {}
    else
        promises = []
        each keys, (v)->
            promises.push data[v]

        $.when.apply(null, promises).done (args...)->
            vData = {}
            util.each args, (v, k)=>
                key = keys[k]
                if key
                    # 坑
                    if util.isArray(v) and v.length == 3 and v[2].promise
                        v = v[0]
                    vData[key] = v

            dtd.resolve vData
        .fail (err)->
            dtd.reject err
        
    dtd.promise()

class BaseClass extends EventEmitter

    constructor: ->
        # 当前 view id
        @_id = _id++

        # 属性
        @.$win = $win
        @.$body = $body
        @util = util
        @nextTick = util.nextTick

        # 是否在微信中打开
        @isWeixinBrowser = _isWeixinBrowser
        # 是否在ios中打开
        @isIOS = _isIOS

        @template = false

        @beforeInit()
        @init()
        @watch()


    beforeInit: ->


    init: ->


    watch: ->

    # 渲染
    render: (@virtualDomDefine, scope = {})->
        if !@template
            @template = new Template()
            @template._proxy = @

        dtd = $.Deferred()
        
        loadPromise(scope).then (scope)=>
            @template.render @virtualDomDefine, scope, (refs)=>
                @emit 'rendered', refs
                dtd.resolve refs
        .fail (err)->
            dtd.reject err

        dtd.promise()
        

    set: (key, value)->
        return if !@template
        if util.isFunction value.then
            return value.then (val)=>
                @template.set key, val
        else
            @template.set key, value

    get: ->
        @template.get.apply @template, arguments if @template


    remove: ->
        @template.remove.apply @template, arguments if @template
        

    clone: (value)->
        util.extend true, value

        
    destroy: ->
        @template.destroy() if @template


    when: ->
        $.when.apply @, arguments

module.exports = BaseClass
