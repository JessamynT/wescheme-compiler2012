easyXDM.WidgetManager=function(a){function h(c,b){c.initialize(m,function(i){if(i.isInitialized){g[b]=c;for(var j=i.subscriptions.length;j--;){var e=b,l=i.subscriptions[j];l in f||(f[l]=[]);f[l].push(e)}}else c.destroy();i={url:b};a.listeners&&a.listeners.event&&a.listeners.event(d,i)})}function k(c,b,i){var j=f[b];if(j)for(var a=j.length,d;a--;)d=j[a],d!==c&&g[d].send(c,b,i)}function e(c,b){var d=new easyXDM.Rpc({channel:"widget"+n++,local:o,remote:c,container:b.container||p,swf:a.swf,onReady:function(){h(d,
c,b)}},{local:{subscribe:{isVoid:!0,method:function(b){b in f||(f[b]=[]);f[b].push(c)}},publish:{isVoid:!0,method:function(b,a){k(c,b,a)}}},remote:{initialize:{},send:{isVoid:!0}}})}var d=this,o=a.local,n=0,g={},f={},m={hosturl:location.href};easyXDM.apply(m,a.widgetSettings);var p=a.container||document.body;this.addWidget=function(c,b){if(c in g)throw Error("A widget with this url has already been initialized");e(c,b)};this.removeWidget=function(c){if(c in g){for(var b in f)if(f.hasOwnProperty(b))for(var a=
f[b],d=a.length;d--;)if(a[d]===c){a.splice(d,1);break}g[c].destroy();delete g[c]}};this.publish=function(c,b){k("",c,b)};this.broadcast=function(c){for(var b in g)g.hasOwnPropert(b)&&g[b].send({url:"",topic:"broadcast",data:c})}};
easyXDM.Widget=function(a){var h=this,k,e=new easyXDM.Rpc({swf:a.swf},{remote:{subscribe:{isVoid:!0},publish:{isVoid:!0}},local:{initialize:{method:function(){a.initialized(h,e);return{isInitialized:!0,subscriptions:a.subscriptions}}},send:{isVoid:!0,method:function(a,e,h){k(a,e,h)}}}});window.onunload=function(){e.destroy()};this.publish=function(a,h){e.publish(a,h)};this.subscribe=function(a){e.subscribe(a)};this.registerMessageHandler=function(a){k=a};a.initialize(this,e)};
