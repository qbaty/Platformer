define("dist/script/entrance",["platformer","./data"],function(a){var b=a("platformer"),c=a("./data"),d=document.body,e=[];d.addEventListener("keydown",function(a){e[a.keyCode]=!0}),d.addEventListener("keyup",function(a){e[a.keyCode]=!1});var f=b.Platform.instance(),g=b.Canvas.instance("sky"),h=b.Canvas.instance("floor"),i=b.Canvas.instance("background"),j=b.Canvas.instance("entity"),k=b.Canvas.instance("cloud"),l=b.Canvas.instance("main");g.minHeight=480,h.minHeight=480,k.minHeight=480,i.minHeight=480,j.minHeight=480,l.minHeight=480,f.layout(function(){g.width(window.innerWidth),g.height(window.innerHeight),h.width(window.innerWidth),h.height(window.innerHeight),k.width(window.innerWidth),k.height(window.innerHeight),i.width(window.innerWidth),i.height(window.innerHeight),j.width(window.innerWidth),j.height(window.innerHeight),l.width(window.innerWidth),l.height(window.innerHeight)});var m="#906643",n="#00b5f3",o=new b.RecArtist,p=new b.Sprite("Sky",o,[]);p.color=n,p.width("100%"),p.height("100%"),p.drawTo(g);var q=new b.SpriteSheetArtist("/dist/img/app-sprite.png",c.grove),r=new b.Sprite("Grove",q,[]);r.aspectRatio=5782/525,r.width("auto"),r.height("65%"),r.top("30.9%"),r.drawTo(i);var s=new b.TimeBehavior({start:{top:"100%"},end:{top:"88%"},duration:1e3,decorate:"start",easing:b.AnimationTimer.easeOut()}),t=new b.Sprite("Floor",o,[s]);t.color=m,t.width("100%"),t.height("13%"),t.drawTo(h);var u=new b.SpriteSheetArtist("/dist/img/app-sprite.png",c.banner),v=new b.Sprite("Banner",u,[]);v.aspectRatio=337/216,v.width("auto"),v.height("30%"),v.top("30%"),v.left("13%",r),v.drawTo(j);var w=133/82,x="auto",y="12%",z=new b.SpriteSheetArtist("/dist/img/app-sprite.png",c.cloud),A=new b.Sprite("Cloud",z,[]);A.aspectRatio=w,A.width(x),A.height(y),A.top("35%"),A.left("10.5%",r),A.drawTo(k);var B=new b.Sprite("Cloud",z,[]);B.aspectRatio=w,B.width(x),B.height(y),B.top("20%"),B.left("24%",r),B.drawTo(k);var C=new b.Sprite("Cloud",z,[]);C.aspectRatio=w,C.width(x),C.height(y),C.top("15%"),C.left("43%",r),C.drawTo(k);var D=new b.Sprite("Cloud",z,[]);D.aspectRatio=w,D.width(x),D.height(y),D.top("18%"),D.left("54%",r),D.drawTo(k);var E=new b.Sprite("Cloud",z,[]);E.aspectRatio=w,E.width(x),E.height(y),E.top("28%"),E.left("61%",r),E.drawTo(k);var F=new b.Sprite("Cloud",z,[]);F.aspectRatio=w,F.width(x),F.height(y),F.top("24%"),F.left("69%",r),F.drawTo(k);var G=new b.Sprite("Cloud",z,[]);G.aspectRatio=w,G.width(x),G.height(y),G.top("40%"),G.left("80%",r),G.drawTo(k);var H=new b.SpriteSheetArtist("/dist/img/app-sprite.png",c.manWalkRight),I=new b.CycleBehavior(function(a){a.runToLeft=function(b){a.artist.cells=c.manWalkLeft,a.jumping||(a.animationRate=b)},a.runToRight=function(b){a.artist.cells=c.manWalkRight,a.jumping||(a.animationRate=b)},a.stop=function(){a.animationRate=0}}),J=new b.JumpBehavior,K=new b.TimeBehavior({start:{top:0},end:{top:"63.1%"},duration:1e3,decorate:"fall",easing:b.AnimationTimer.easeOut()}),L=new b.CollideBehavior({canvas:j,processCollision:function(){}}),M=new b.MoveBehavior,N=new b.Sprite("Man",H,[I,J,K,L,M]);N.hide(),N.aspectRatio=140/172,N.width("auto"),N.height("25%"),N.center(),N.drawTo(l);var O=new b.CycleBehavior(function(a){a.animate=function(b){a.animationRate=b}}),P=new b.SpriteSheetArtist("/dist/img/app-sprite.png",c.contactMan),Q=new b.Sprite("ContactMan",P,[O]);Q.aspectRatio=110/182,Q.width("auto"),Q.height("25%"),Q.top("63.1%"),Q.left("36%",r),Q.drawTo(j);var R=new b.CycleBehavior(function(a){a.animate=function(b){a.animationRate=b}}),S=new b.SpriteSheetArtist("/dist/img/app-sprite.png",c.assistant),T=new b.Sprite("Assistant",S,[R]);T.aspectRatio=120/172,T.width("auto"),T.height("25%"),T.top("63.1%"),T.left("48.5%",r),T.drawTo(j);var U=new b.CycleBehavior(function(a){a.animate=function(b){a.animationRate=b}}),V=new b.SpriteSheetArtist("/dist/img/app-sprite.png",c.qrcodeMM),W=new b.Sprite("QrcodeMM",V,[U]);W.aspectRatio=130/137,W.width("auto"),W.height("20%"),W.top("72%"),W.left("56.5%",r),W.drawTo(j);var X=new b.CycleBehavior(function(a){a.animate=function(b){a.animationRate=b}}),Y=new b.SpriteSheetArtist("/dist/img/app-sprite.png",c.printer),Z=new b.Sprite("Printer",Y,[X]);Z.aspectRatio=260/201,Z.width("auto"),Z.height("28%"),Z.top("60.5%"),Z.left("66%",r),Z.drawTo(j);var $=34/45,_="auto",ab="7%",bb="70%",cb=new b.SpriteSheetArtist("/dist/img/app-sprite.png",c.coin),db=new b.Sprite("Coin",cb,[]);db.aspectRatio=$,db.width(_),db.height(ab),db.top(bb),db.left("39%",r),db.drawTo(j);var eb=new b.Sprite("Coin",cb,[]);eb.aspectRatio=$,eb.width(_),eb.height(ab),eb.top(bb),eb.left("41%",r),eb.drawTo(j);var fb=new b.Sprite("Coin",cb,[]);fb.aspectRatio=$,fb.width(_),fb.height(ab),fb.top(bb),fb.left("43%",r),fb.drawTo(j);var gb=new b.Sprite("Coin",cb,[]);gb.aspectRatio=$,gb.width(_),gb.height(ab),gb.top(bb),gb.left("60%",r),gb.drawTo(j);var hb=new b.Sprite("Coin",cb,[]);hb.aspectRatio=$,hb.width(_),hb.height(ab),hb.top(bb),hb.left("62%",r),hb.drawTo(j);var ib=new b.Sprite("Coin",cb,[]);ib.aspectRatio=$,ib.width(_),ib.height(ab),ib.top(bb),ib.left("64%",r),ib.drawTo(j);var jb=new b.SpriteSheetArtist("/dist/img/app-sprite.png",c.desk),kb=new b.Sprite("Desk",jb,[]);kb.aspectRatio=358/276,kb.width("auto"),kb.height("32%"),kb.top("56.4%"),kb.left("51.2%",r),kb.drawTo(j);var lb=new b.SpriteSheetArtist("/dist/img/app-sprite.png",c.flag),mb=new b.Sprite("Flag",lb,[]);mb.aspectRatio=122/375,mb.width("auto"),mb.height("50%"),mb.top("38%"),mb.left("81%",r),mb.drawTo(j);var nb=new b.SpriteSheetArtist("/dist/img/app-sprite.png",c.flower),ob=new b.Sprite("Flag",nb,[]);ob.aspectRatio=95/156,ob.width("auto"),ob.height("20%"),ob.top("70%"),ob.left("45%",r),ob.drawTo(i);var pb=new b.Sprite("Flag",nb,[]);pb.aspectRatio=95/156,pb.width("auto"),pb.height("20%"),pb.top("70%"),pb.left("72%",r),pb.drawTo(i);var qb=new b.SpriteSheetArtist("/dist/img/app-sprite.png",c.barrier),rb=new b.Sprite("Flag",qb,[]);rb.aspectRatio=174/154,rb.width("auto"),rb.height("20%"),rb.top("71%"),rb.left("78%",r),rb.drawTo(i),b.NotificationCenter.instance().add({sender:i,receiver:N,when:function(a){return!a.canMoveToLeft()},"do":function(a,b){b.moveToLeft(Math.abs(a.velocity))}}),b.NotificationCenter.instance().turnOn(),f.add([g,h,i,l,k,j,p,r,t,v,N,A,B,C,D,E,F,G,T,Q,W,Z,kb,mb,ob,pb,rb,db,eb,fb,gb,hb,ib]).draw(),f.start(function(){t.start(function(){N.show(),N.fall()})}),f.update(function(){Q.animate(4),T.animate(4),W.animate(4),Z.animate(4),e[37]?(N.runToLeft(10),i.moveToLeft(200),j.moveToLeft(200),k.moveToLeft(150)):e[39]&&(N.runToRight(10),i.moveToRight(200),j.moveToRight(200),k.moveToRight(150)),e[38]?N.jump():e[40],e[37]||e[39]||(N.stop(),i.stop(),j.stop(),k.stop())})}),define("dist/script/data",[],function(a,b){b.grove=[{left:0,top:0,width:5782,height:525}],b.manWalkRight=[{left:0,top:524,width:140,height:172},{left:140,top:524,width:140,height:172},{left:280,top:524,width:140,height:172},{left:420,top:524,width:140,height:172},{left:560,top:524,width:140,height:172},{left:700,top:524,width:140,height:172}],b.manWalkLeft=[{left:0,top:697,width:140,height:172},{left:140,top:697,width:140,height:172},{left:280,top:697,width:140,height:172},{left:420,top:697,width:140,height:172},{left:560,top:697,width:140,height:172},{left:700,top:697,width:140,height:172}],b.banner=[{left:2275,top:525,width:337,height:216}],b.cloud=[{left:1401,top:740,width:133,height:82}],b.assistant=[{left:840,top:525,width:110,height:182},{left:950,top:525,width:110,height:182}],b.contactMan=[{left:840,top:726,width:119,height:174},{left:960,top:726,width:119,height:174}],b.qrcodeMM=[{left:1119,top:726,width:130,height:137},{left:1249,top:726,width:130,height:137}],b.printer=[{left:1060,top:525,width:260,height:201},{left:1320,top:525,width:260,height:201}],b.desk=[{left:1580,top:525,width:358,height:276}],b.flag=[{left:1960,top:525,width:122,height:375}],b.flower=[{left:2100,top:679,width:95,height:156}],b.barrier=[{left:2100,top:525,width:174,height:154}],b.coin=[{left:2195,top:679,width:34,height:45}]});