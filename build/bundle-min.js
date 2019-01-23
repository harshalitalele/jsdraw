function DrawingBoard(){return new DrawingBoard.Board}!function(e){var t={boardBase:"body",drawStyles:["freeform"],saveHandler:function(){void 0},clearAllHandler:function(){void 0},toolboxStyles:{},elemProp:{}};e.Board=function(n){n=Object.assign(t,n),this.saveHandler=n.saveHandler,this.clearAllHandler=n.clearAllHandler;var o=new e.Overlay(n.elemProp);this.toolbox=new e.Toolbox({overlay:o.canvas,controls:{saveHandler:function(e){void 0},clearAllHandler:function(){}}}),this.showToolbox=function(){this.toolbox.show(),o.show()},this.hideToolbox=function(){this.toolbox.hide(),o.hide()}}}(DrawingBoard),function(e){var t={markers:["freeform"],controls:{saveHandler:function(){},clearAllHandler:function(){}}};e.Toolbox=function(n){n=Object.assign(t,n);var o=function(e){var t=document.createElement("div");return tbStyle=t.style,tbStyle.backgroundColor="rgba(255,0,0,0.2)",tbStyle.width="auto",tbStyle.height="60px",tbStyle.padding="5px",tbStyle.border="1px solid black",tbStyle.borderRadius="5px",tbStyle.position="absolute",tbStyle.top=0,tbStyle.right=0,t}(),i=[];n.hasOwnProperty("overlay")?n.overlay.parentElement.appendChild(o):void 0;var s=new e.actions(n.overlay);function r(e){var t;(t=n.overlay).getContext("2d").clearRect(0,0,t.width,t.height),t.style.display="none",i.push(e)}s.attachActions();var a=n.controls.saveHandler,l=n.controls.clearAllHandler;n.controls.saveHandler=function(){a(i)},n.controls.clearAllHandler=function(){for(var e in i)i[e].deleteMarker();l(i=[])},function(e,t,n){for(var o in e){var i=e[o],s=document.createElement("div"),r=s.style;switch(r.height="32px",r.width="32px",r.margin="5px",r.border="1px solid black",r.borderRadius="4px",i){case"freeform":s.innerText="F",r.textAlign="center",s.addEventListener("click",function(e){n("freeform")})}t.appendChild(s)}}(n.markers,o,function(t){n.overlay.style.display="block";var o=null;switch(t){case"freeform":o=new e.freeformAction}o.setUpHandler(r),s.setBehavior(o)}),function(e,t){for(var n in e)if(e[n]){var o=document.createElement("button"),i=o.style;switch(i.width="32px",i.height="32px",i.margin="5px",i.border="1px solid black",i.borderRadius="4px",n){case"saveHandler":o.innerText="S",o.addEventListener("click",function(t){e.saveHandler()});break;case"clearAllHandler":o.innerText="X",o.addEventListener("click",function(t){e.clearAllHandler()})}t.appendChild(o)}}(n.controls,o),e.Toolbox.prototype.get=function(){return o},e.Toolbox.prototype.show=function(){return o.style.display="block"},e.Toolbox.prototype.hide=function(){return o.style.display="none"}}}(DrawingBoard),function(e){function t(e){var t=document.createElement("canvas"),n=function(e){return e.hasOwnProperty("id")?document.getElementById(e.id):document.body}(e),o=n.getClientRects()[0];t.width=o.width,t.height=o.height;var i=t.style;return i.width=o.width+"px",i.height=o.height+"px",i.position="absolute",i.top=0,i.left=0,n.appendChild(t),t}e.Overlay=function(n){void 0,this.canvas=t(n)},e.Overlay.prototype.show=function(){this.canvas.style.display="block"},e.Overlay.prototype.hide=function(){this.canvas.style.display="none"}}(DrawingBoard),function(e){"use strict";var t=!!window.hasOwnProperty("ontouchstart"),n={DOWN:t?"touchstart":"mousedown",MOVE:t?"touchmove":"mousemove",UP:t?"touchend":"mouseup",LEAVE:t?"touchleave":"mouseleave"};e.actions=function(e){this.baseElement=e,this.isActionStarted=!1,this.isActionCompleted=!1,this.implementedAction=null},e.actions.prototype.attachActions=function(){var e=this;function t(t,n){var o=e.baseElement.getClientRects()[0];return{x:t-o.left,y:n-o.top}}this.mousedownListener=function(t){e.isActionStarted=!0,e.isActionCompleted=!1,e.baseElement.width=parseFloat(e.baseElement.getClientRects()[0].width),e.baseElement.height=parseFloat(e.baseElement.getClientRects()[0].height)},this.mousemoveListener=function(n){e.isActionStarted&&!e.isActionCompleted&&(n.x&&n.y||(n.x=n.touches[0].clientX,n.y=n.touches[0].clientY),e.implementedAction.actionChangeBehavior(e.baseElement,t(n.x,n.y)))},this.mouseupListener=function(n){e.isActionStarted=!1,e.isActionCompleted=!0,n.x&&n.y||(n.x=n.touches[0].clientX,n.y=n.touches[0].clientY),e.implementedAction.actionCompleteBehavior(e.baseElement,t(n.x,n.y))},this.mouseleaveListener=function(t){e.isActionStarted=!1,e.isActionCompleted=!0},this.baseElement.addEventListener(n.DOWN,this.mousedownListener),this.baseElement.addEventListener(n.MOVE,this.mousemoveListener),this.baseElement.addEventListener(n.UP,this.mouseupListener),this.baseElement.addEventListener(n.LEAVE,this.mouseleaveListener)},e.actions.prototype.detachActions=function(){this.baseElement.removeEventListener(n.DOWN,this.mousedownListener),this.baseElement.removeEventListener(n.MOVE,this.mousemoveListener),this.baseElement.removeEventListener(n.UP,this.mouseupListener),this.baseElement.removeEventListener(n.LEAVE,this.mouseleaveListener)},e.actions.prototype.setBehavior=function(e){this.implementedAction=e}}(DrawingBoard),function(e){var t=!0;function n(e,t){return(t.y-e.y)/(t.x-e.x)}function o(e,t){e.x<t.x?(t.width+=t.x-e.x,t.x=e.x):e.x>t.x+t.width&&(t.width=e.x-t.x),e.y<t.y?(t.height+=t.y-e.y,t.y=e.y):e.y>t.y+t.height&&(t.height=e.y-t.y)}function i(e){var t,n={x:e[0].x,y:e[0].y,width:0,height:0},o=e[0].x,i=e[0].y;for(t=1;t<e.length;t+=1){var s=e[t];s.x<n.x?n.x=s.x:s.x>o&&(o=s.x),n.width=o-n.x,s.y<n.y?n.y=s.y:s.y>i&&(i=s.y),n.height=i-n.y}return n}e.freeformAction=function(e,t){e=e||{},this.type="Freeform",this.color="#00ff00",this.lineWidth=4,this.points=[],this.comment="",Object.assign(this,e),this.actionBoundaries=t||(this.points&&this.points.length>0?i(this.points):{x:0,y:0,width:0,height:0}),this.element=null,this.upHandler=null},e.freeformAction.prototype.actionChangeBehavior=function(e,n){var i=e.getContext("2d");i.strokeStyle=this.color,i.lineWidth=this.lineWidth,t?(this.actionBoundaries.x=n.x,this.actionBoundaries.y=n.y,i.beginPath(),i.moveTo(n.x,n.y),this.points.push(n),t=!1):(i.lineTo(n.x,n.y),i.stroke(),this.points.push(n),o(n,this.actionBoundaries))},e.freeformAction.prototype.actionCompleteBehavior=function(e,n){var i=e.getContext("2d");i.lineTo(n.x,n.y),i.stroke(),i.closePath(),this.points.push(n),o(n,this.actionBoundaries),this.showMarker(this.points,e.parentNode),t=!0,this.upHandler(this)},e.freeformAction.prototype.fillColor=function(e){var t=document.createElement("canvas");t.width=this.actionBoundaries.width,t.height=this.actionBoundaries.height,t.style.width=this.actionBoundaries.width+"px",t.style.height=this.actionBoundaries.height+"px";var n=t.getContext("2d");n.beginPath();var o,i=this.points,s=this.actionBoundaries.x,r=this.actionBoundaries.y;for(n.moveTo(i[0].x-s,i[0].y-r),o=1;o<i.length;o+=1){var a=i[o];n.lineTo(a.x-s,a.y-r)}n.lineTo(i[0].x-s,i[0].y-r),n.stroke(),n.closePath(),n.fillStyle="blue",n.fill(),this.element.appendChild(t),t.style.width="100%",t.style.height="100%"},e.freeformAction.prototype.showMarker=function(e,t){var o,s=document.createElement("div"),r=e[0];for(void 0,e=function(e,t){t=t||parseFloat(document.getElementById("tolerance").value);for(var o=[e[0],e[1]],i=e[0],s=n(e[1],i),r=e.length,a=2;a<r;a++){var l=e[a];if(!(Math.abs(l.x-i.x)<3&&Math.abs(l.y-i.y)<3)){var h=n(l,i);Math.abs(h-s)<t&&o.pop(),o.push(l),i=l,s=h}}return o}(e,.15),void 0,s.setAttribute("id","freeform-marker"),this.actionBoundaries&&0!==this.actionBoundaries.width||(this.actionBoundaries=i(e)),s.style.width=this.actionBoundaries.width+"px",s.style.height=this.actionBoundaries.height+"px",s.style.zIndex="2",this.size=this.actionBoundaries.width*this.actionBoundaries.height,o=1;o<e.length;o+=1){var a=e[o],l=document.createElement("hr"),h=a.x-r.x,c=a.y-r.y,d=Math.sqrt(h*h+c*c),u=180*Math.atan2(a.y-r.y,a.x-r.x)/Math.PI;l.style.borderColor="#00ff00",l.style.borderWidth="2px",l.style.width=100*d/this.actionBoundaries.width+"%",l.style.height="0px",l.style.position="absolute",l.style.top=100*(r.y-this.actionBoundaries.y)/this.actionBoundaries.height+"%",l.style.left=100*(r.x-this.actionBoundaries.x)/this.actionBoundaries.width+"%",l.style.margin="0px",l.style.transformOrigin="left center",l.setAttribute("noshade",""),l.style.transform="rotate("+u+"deg)",s.appendChild(l),r=e[o]}this.element=s,this.element.style.position="absolute",this.element.style.top=this.actionBoundaries.y+"px",this.element.style.left=this.actionBoundaries.x+"px",this.element.style.pointerEvents="none",t.appendChild(this.element)},e.freeformAction.prototype.setUpHandler=function(e){this.upHandler=e},e.freeformAction.prototype.deleteMarker=function(){this.element.parentNode.removeChild(this.element)}}(DrawingBoard);