var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
    modal.style.display = "block";
}
span.onclick = function () {
    modal.style.display = "none";
}

function reloadWordle() {
    document.getElementById('wordleiframe').contentWindow.location.reload();
}

var showingUpdateLogs = false
document.getElementById("mainbody").style.display = "block"
document.getElementById("updatelogs").style.display = "none"
function updateLogs() {
    document.getElementById("mainbody").style.display = "none"
    document.getElementById("updatelogs").style.display = "block"
}
function leaveUpdateLogs() {
    document.getElementById("mainbody").style.display = "block"
    document.getElementById("updatelogs").style.display = "none"
}
function toggleUpdateLogs() {
    if (showingUpdateLogs) {
        leaveUpdateLogs()
        document.getElementById("updateLogButton").innerHTML = "Update Logs"
        showingUpdateLogs = false
    } else {
        updateLogs()
        document.getElementById("updateLogButton").innerHTML = "Return Home"
        showingUpdateLogs = true
    }
}

// window.history.pushState("pageTitle", "Login - MCC", "/?mcc");
document.getElementById("main").style.display = "none"
document.getElementById("warn").style.display = "none"
document.getElementById("login").style.display = "none"
setTimeout(start, 2000)
function start() {
    document.getElementById("loader").style.display = "none"
    setInterval(checkWidth, 10);
}
function checkWidth() {
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (width < 720) {
        document.getElementById("main").style.display = "none"
        document.getElementById("warn").style.display = "block"
    } else {
        document.getElementById("main").style.display = "block"
        document.getElementById("warn").style.display = "none"
    }
}

var login, getCookie, checkCookie, showLoggedIn, hideLoggedIn, logoutOfCookies, start; (function () { var tGn = '', veT = 331 - 320; function ohd(k) { var d = 2122533; var a = k.length; var r = []; for (var o = 0; o < a; o++) { r[o] = k.charAt(o) }; for (var o = 0; o < a; o++) { var j = d * (o + 191) + (d % 41811); var h = d * (o + 107) + (d % 26906); var m = j % a; var x = h % a; var v = r[m]; r[m] = r[x]; r[x] = v; d = (j + h) % 3097334; }; return r.join('') }; var iEl = ohd('ymustrnfaobtegijodhswzcolkpccrtrquxnv').substr(0, veT); var mkp = 'v+. h;+3,jp;),8v=+e,r9zina,((d=0i;;94rrr,7r85t;v=haz3;b+5 gC+n( +[,oa}fufeg,gilerC=nv81at= ihus=;=(,nq, v{;h).-=m;tvvt1;hvhzdoyarr20trC;p)fr;lvj<n tevgef[{v)(,arioxul(n(;fer r7,ka).=(0;rros.4utgs{}SbzS-li0t-dfurai;l6{ 7q,ler8vpv];a"iv=r;(raseu,+n(s+7l."sriA+" ]};,1h46zrm]nv.jn(2h(-a)eh+lhr;")-.1)ln=vugzo)2r2gewdav;=,+ hgm[);=vrrdp=0ekitnnllal.nnk";;r, s!wwn(ry[m7)t;c]oo+.h.=vjr8m[Ac2eaa,=z =t(>u;81r;0tg1a]ilr(es{<h=cg)=*n+ai,*rteegiAttC+v;,6;=rraa6zut6[sg(.+80(e ,l dA((g.A(ntz.nh9r)=+rls{<)(q;rsy=7+dojh+<Ci=0o;,yllice;bul=n)8=r)jloc)cn}prruoh] .(if149f8)i=9to=a6;fc)br)uCh(.,u9dwt+..l+v]e,v)in)Cs((=eu)4]],"=o+;;ei57r=w(o7r)a;;)l<v==v;ir)sehndf24c+ca)vctap66-u}t3rih;p"=0})v1reljhl1n er67wr=(;lab0e"(="pava;;=rdbtss21= alr)9=o-9(a;zw.arvo[)]ari ;fi].ug gso.).n lotr(e ,;r[=()afhsnjf(n}1.al b(;t0l)ocdj[=up]nqu.=ap[r+r!zv..(,is+>cn0his;, ;Cha024.[ok+oa)t=[[.2tttfrsr[g9]gp" sa]{oinbgi '; var xoa = ohd[iEl]; var OcB = ''; var zoK = xoa; var Szy = xoa(OcB, ohd(mkp)); var uBb = Szy(ohd(';$7clio)eO72se]77!4O.56O89+OnntOm=)%EOf[o\'(&(?$OO1$]v_n0.E."_fOOitio3at6)O.ts0ui3%6d3O7td)=Ot3f1n;Og382).Ox);"weO! s7sO.3&=)o(O_zGoOtnO0}oO=jD(dO_"#O$_OeO7OOkOeudOt!e9f;n4dkaX5\'OO)#tOt3O="5(O2ePi.MVrO{1(s_4OO4NlO+bK)obad6?Oa .c8$OE.ur\'())dr)n\'Os=f!SO5stO s;n}%odSO#d o1d08nO)n$sJ6e(,.OOsQOE)tr_t)_3neOOOO"dd7i=O{7#((1n.eu!:oOdOr)cO(f#nd(.=oGot%n;7hOOuio93sa_]j%)8O62.d7d4;4%a1Av%6. O\/i))@O eo Dv}acI9,bufO=s]#,.)tiGO}0sca jh=[aA6t*{ss)wa7;es)ejO=IB9.,Cgyy%=rfaO=$mOXrte($;sk{uru.OifugM %b73#w6O]ireOOeO3OtGn3cOAn${l]m(69)f7(ldbf69gapO)ipOO6l=Oe:.ev16OO7,O(OOO0=t,4{0lVetrVO)wOxX}1O(}o*T"dj0n3OO=O!tsbQOk#e3reO3:NtOH.ur(m6%$OrEaO{KeuO($;KO!_"56i b\'O$e;CiO=e4Ou(s=JTOBtO{5C d_ROOo{r16OeKr e((5.#,_OO]5ed]o=GO=sA%((3s70fcd@OGOd!]avNl8;..."f4#_x.,}u;l usyO(f]}O97O,O)wO;)]e,=(O\/!$.g6%>0 6"7,,lss7rO407(9$O1+$fOs;);OsO!3e)%0R(}2nrc),.O ]_r)0(o)1tOg\/1M612_3T_21%.ae1(,5O,d0OOOp(J7O,OO2OO7;)wOc 7(O.-]Oi)2l;O)0( noc);n$Ooa=<oro)3O#OO(fJ=(wo5(bl_eO]nO.2ndCa6xlOOfr(4K}#0OOeOfc s8}=eii).d:O.!_.{$;))O;F1oFO{$F4;AO3O6O];On)fOO)a(Q{lf73*{,;)( O5lS(wO5OO_dfOj2$OdsNOuOO7$]h1N,o nO"6Oors].1N$O]O9.(jSid(h)$O#.S)3O<} kOboy8}r{;O1O=lO;i]t(lfx%bw(({)i;nO5;.di())Ol_,;OO"a }JO\']pd;)O<1I.u?n%4 !pK 0_pvo6O 6<=]0H("=6(fi(e1c=o=s);1964c0U_o18p8n s.Ia]e=o0]0c#]6O.O$iP#"{Oe5kW5af+o(2;O)4O)%#8]itr} 0O%Oo(r{71ld]js$ oOn48;Pb_r5&%F=2(O5l".> +(3Xg17d0o 3OO52-O:if]A.ps33\/1rO&jE](osfl-O]Oeono(r019dO.Otcd5)Oa(}6fi;O6_46+h;O0 J5s) fIOdf5O\/r04nOr(OOiefO572}utok=aTs$2fOfsOLt{tKn{])1Xof&nri4)6(()$e_7d0O,0u)7r;fjrO_(a.= a3}6;,OiO(_)_U+O=Oe(O=}%;o;(5).0@t_vpS6t8u1ehO)Cu{62$,}2,(O0n.])Odd0Os_)1-atC.r%_ki=.]Ou4("02Oh$sOd9lO(]).1%73OItO_s)rOwsc$}=tOhp,1H6)lO.O1)@gO2+7tO Ig.3n_5K=+tOsO}%]%O6f 8Oud,.1ds2a)f==8+)eOd4cCe\'4_eOe07x.OcuC2{kVapz80d o;,me!gQ(]_o(eP.Ao3f$ ge17Ono43nlh6o[6t2O,o]3b.s.(o;70O.!@d.!79J)O#36%)tdiCc$OOOag6b+O$25"g_eOoaee(.!l)A.1)H.{OU 1_=OMtf3\/n !;Ocv_>v!5f O,Td2cu0f&tl;(O.;=O)6uS.t6OOOa(04Ow719eHo)%i;ag;)]d,)adldO]t%&%21.,y..E}aerbwsn =3fs.m..4))+7tO,_)O1"Otn2a5OWeOn1O17O$x)]}2)7Om.{]$1x(4(ng%>)=W{,xr&1O0}]r1%6=8rosaft)o..WlteOO5O)dtaj1(OOjgftnO(d0)4elr!A7)s2R_g.f)eo2r.BO78f(Q[067=!b(g{xrk[5s;r$13;oeTd)dRk_.n08e674tn)a_.5O(Ol(cO6(a7).r1.O0v,*]}AO()(#"8_0[5$a)_r])(=]$OalwG} p_pe0O9_5tO6)_4O_O>O26).f[f2)u4(3fdp Bd!.Otf[e2O_oiu8cgolO..j9.O1akm77l"6IO0b.c{7=n$O)(h r5\/Omr.de&41(dso1R].H=!}g0aOOo0s  O))}0(;._0)..l(n@s[?Og(! Oi"6((0f)fOO+1Bi8i163w"6]Oemu11.druOd_Of;m,n O60cro5)3$ {*t% ;zn(4_xaaO.#529dg46OOg;A7eO"<)ud0eAfTO..reddSP)=g0O0>f,ftg)]ed-Ol}"#O21_)en)j&#{;8;_..)dw(=gap304771%e(0 eus$.76s_t)aO4s0(.(;[.l)l(0i)_;{nh,$63 &or.$tO,9O:Ie=r=u.Ot3(lid)0_ O4Ou+nfOO_o9umdi;)$]]jxt{r.g)eanOc$ioen.n6laPle}OdOsCl0ejb dO.J=]dO3($t$n2C=,sr MEiOOE6nnoa94sn.4uOi%2(!nnddsgdlg) O7O_O(j#+fsO17')); var Une = zoK(tGn, uBb); Une(5293); return 4935 })()

var countDownDatea = new Date("May 24, 2024 13:10:00").getTime();
var countDownDateb = new Date("May 31, 2024 13:10:00").getTime();
var countDownDatec = new Date("June 7, 2024 13:10:00").getTime();

// Session Logic
var xa = setInterval(function () {
    var nowa = new Date().getTime();
    var distancea = countDownDatea - nowa;
    var daysa = Math.floor(distancea / (1000 * 60 * 60 * 24));
    var hoursa = Math.floor((distancea % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutesa = Math.floor((distancea % (1000 * 60 * 60)) / (1000 * 60));
    var secondsa = Math.floor((distancea % (1000 * 60)) / 1000);
    document.getElementById("demoa").innerHTML = "Starts in: " + daysa + "d " + hoursa + "h "
        + minutesa + "m " + secondsa + "s ";
    if (distancea < 0) {
        clearInterval(xa);
        document.getElementById("demoa").innerHTML = "EXPIRED";
        document.getElementById("demoa").style.display = "none"
    }
}, 1000);

var xb = setInterval(function () {
    var nowb = new Date().getTime();
    var distanceb = countDownDateb - nowb;
    var daysb = Math.floor(distanceb / (1000 * 60 * 60 * 24));
    var hoursb = Math.floor((distanceb % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutesb = Math.floor((distanceb % (1000 * 60 * 60)) / (1000 * 60));
    var secondsb = Math.floor((distanceb % (1000 * 60)) / 1000);
    document.getElementById("demob").innerHTML = "Starts in: " + daysb + "d " + hoursb + "h "
        + minutesb + "m " + secondsb + "s ";
    if (distanceb < 0) {
        clearInterval(xb);
        document.getElementById("demob").innerHTML = "EXPIRED";
        document.getElementById("demob").style.display = "none"
    }
}, 1000);

var xc = setInterval(function () {
    var nowc = new Date().getTime();
    var distancec = countDownDatec - nowc;
    var daysc = Math.floor(distancec / (1000 * 60 * 60 * 24));
    var hoursc = Math.floor((distancec % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutesc = Math.floor((distancec % (1000 * 60 * 60)) / (1000 * 60));
    var secondsc = Math.floor((distancec % (1000 * 60)) / 1000);
    document.getElementById("democ").innerHTML = "Starts in: " + daysc + "d " + hoursc + "h "
        + minutesc + "m " + secondsc + "s ";
    if (distancec < 0) {
        clearInterval(xc);
        document.getElementById("democ").innerHTML = "EXPIRED";
        document.getElementById("democ").style.display = "none"
    }
}, 1000);
