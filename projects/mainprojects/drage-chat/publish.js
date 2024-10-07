import { dragechatServerVersion, dragechatAllowUsage } from "https://drageno01.github.io/version.js";import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";import { getFirestore, addDoc, collection, onSnapshot, doc, getDocs, query, where, } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";const firebaseConfig = {apiKey: "AIzaSyChVEPH5BqCy-mUzPx0vXhcKHEO56Qgv2M",authDomain: "drage-chat.firebaseapp.com",projectId: "drage-chat",storageBucket: "drage-chat.appspot.com",messagingSenderId: "946400520996",appId: "1:946400520996:web:3f7a6caf2bef6913dfa1b1"};
let clientVersion = 0.00005;if(dragechatServerVersion == clientVersion){document.getElementById("outofdateclient").style.display = "none";}else {document.getElementById("outofdateclient").style.display = "block";}if(!dragechatAllowUsage){document.getElementById("usageshutdown").style.display = "block";}else {document.getElementById("usageshutdown").style.display = "none";};const app = initializeApp(firebaseConfig);const db = getFirestore(app);const auth = getAuth(app);auth.languageCode = 'en';let staffEmails = ["drageno110@gmail.com"];let testerEmails = ["sinxbax301@outlook.com"];let vipEmails = ["drageno110@gmail.com", "b.drageno01@gmail.com"];const date = new Date();let authenticatedLogin = false;let day = date.getDate();let month = date.getMonth() + 1;let year = date.getFullYear();let currentDate = `${day}-${month}-${year}`;let setName = date.toJSON().slice(0, 19).replace(":", ".").replace(":", "").replace("-", "").replace("-", "").replace(".", "");const provider = new GoogleAuthProvider();const joinButton = document.getElementById("joinButton");const usernameInput = document.getElementById("usernameInput");const messageInput = document.getElementById("messageInput");const sendButton = document.getElementById("sendButton");const joinView = document.getElementById("joinView");const chatsView = document.getElementById("chatsView");let messageCooldown = 12500;let messages = [];let specifiedUsername = "";let userLoggedIn = false;let uid;let email;let adminStatus = false;let shouldScroll = true;let datenow;joinButton.addEventListener("click", () => {if(!(dragechatServerVersion == clientVersion)){alert("You can not use our platform until you update your client side!");return;}if(!dragechatAllowUsage){alert("You are unable to join the chat currently!");return;};specifiedUsername = usernameInput.value;if (!specifiedUsername) {alert("Username cannot be empty");return;}signInWithPopup(auth, provider).then(async (result) => {const credential = GoogleAuthProvider.credentialFromResult(result);const token = credential.accessToken;const user = result.user;uid = user.uid;email = user.email;if(vipEmails.includes(email)){if(testerEmails.includes(email)){authenticatedLogin = true;specifiedUsername = "<b style='color:green;'><u>"+specifiedUsername+"</u></b> 🪲💎✔️";document.getElementById("staffButtons").style.display = "block";}else if (staffEmails.includes(email)) {authenticatedLogin = true;messageInput.setAttribute('maxlength','3000');document.getElementById("body").style.backgroundColor = "#333";document.getElementById("staffButtons").style.display = "block";adminStatus = true;specifiedUsername = "<b style='color:red;'><u>"+specifiedUsername+"</u></b> 🛠️💎✔️";}else {if (specifiedUsername == "DRAGEno01" && adminStatus == false) {specifiedUsername = Math.round(Math.random() * 100000);}specifiedUsername = "<span style='color:#17F1F4'>"+specifiedUsername+"</span> 💎";}}else {if(testerEmails.includes(email)){authenticatedLogin = true;specifiedUsername = "<b style='color:green;'><u>"+specifiedUsername+"</u></b> 🪲✔️";document.getElementById("staffButtons").style.display = "block";}else if (staffEmails.includes(email)) {authenticatedLogin = true;messageInput.setAttribute('maxlength','3000');document.getElementById("body").style.backgroundColor = "#333";document.getElementById("staffButtons").style.display = "block";adminStatus = true;specifiedUsername = "<b style='color:red;'><u>"+specifiedUsername+"</u></b> 🛠️✔️"}else if(specifiedUsername == "DRAGEno01" && adminStatus == false) {specifiedUsername = Math.round(Math.random() * 100000);}};joinView.classList.add("hidden");chatsView.classList.remove("hidden");userLoggedIn = true;await loadHistoricalMessages();await subscribeToNewMessages();writeMessagesArray();}).catch((error) => {const errorCode = error.code;const errorMessage = error.message;const email = error.customData.email;const credential = GoogleAuthProvider.credentialFromError(error);console.log(errorCode, errorMessage);if (errorCode == "auth/user-disabled") {setTimeout(() => {alert("This account is currently banned from our system.");}, 100);}});});sendButton.addEventListener("click", async () => {if (auth.currentUser) {auth.currentUser.reload().then(async user => {const message = messageInput.value;if (!message == "") {if((message.toLowerCase().includes("<")||message.toLowerCase().includes(">")) && !adminStatus){alert("You are unable to send message with a HTML tag in it.");}else{if(!adminStatus){sendButton.style.display = "none";setTimeout(() => {sendButton.style.display = "block";}, messageCooldown);}messageInput.value = "";datenow = new Date();const docRef = await addDoc(collection(db, "messages"), {user: specifiedUsername,message: message,created: datenow,uid: uid,email: email,staff: adminStatus,});}}}).catch(error => {alert("You are currently unable to send message. Login again to continue.");window.location.href = window.location.href});}});function subscribeToNewMessages() {const q = query(collection(db, "messages"));const unsubscribe = onSnapshot(q, (querySnapshot) => {const newMessages = [];querySnapshot.forEach((doc) => {newMessages.push({id: doc.id,...doc.data(),});});let existingMessageHash = {};for (let message of messages) {existingMessageHash[message.id] = true;}for (let message of newMessages) {if (!existingMessageHash[message.id]) {messages.push(message);}}let allowShowID = false;if (adminStatus == true) {allowShowID = true;}if (allowShowID) {writeMessagesArray(true);} else {writeMessagesArray(false);}});}async function loadHistoricalMessages() {messages = [];const querySnapshot = await getDocs(collection(db, "messages"));querySnapshot.forEach((doc) => {messages.push({id: doc.id,...doc.data(),});});;return messages.sort((a, b) => {if (a.created > b.created) {return 1} else if (a.created < b.created) {return -1} else {return 0}});}function writeMessagesArray(arg) {const html = [];for (let message of messages) {if (arg == true) {html.push(messageTemplate(message.message, message.user, message.created, true, message.uid));} else {html.push(messageTemplate(message.message, message.user, message.created, false, message.uid));}}document.getElementById("messageList").innerHTML = html.join("");if (shouldScroll) {setTimeout(() => {document.getElementById('messageListdiv').scrollTop = (document.getElementById('messageListdiv').scrollHeight)}, 100);}}function messageTemplate(message, username, timestamp, showID, id) {if (shouldScroll) {setTimeout(() => {document.getElementById('messageListdiv').scrollTop = (document.getElementById('messageListdiv').scrollHeight)}, 100);}if (showID) {return `<li><div class="flex space-x-2 pl-2 pt-2"><div class="flex flex-col"><div class="flex items-baseline space-x-2"><div class="text-sm font-bold">${username}</div><div class="text-sm text-gray-400">${new Date(timestamp.seconds * 1000).toLocaleDateString() +" " +new Date(timestamp.seconds * 1000).toLocaleTimeString()}</div></div><div class="text-sm text-gray-500">${message}</div><p class="showUserId" id="messageID">${id}</p></div></div></li>`;} else {return `<li><div class="flex space-x-2 pl-2 pt-2"><div class="flex flex-col"><div class="flex items-baseline space-x-2"><div class="text-sm font-bold">${username}</div><div class="text-sm text-gray-400">${new Date(timestamp.seconds * 1000).toLocaleDateString() +" " +new Date(timestamp.seconds * 1000).toLocaleTimeString()}</div></div><div class="text-sm text-gray-500">${message}</div></div></div></li>`;}}document.getElementById("messageListdiv").setAttribute('scrolling', 'yes');setInterval(() => {if(!authenticatedLogin){adminStatus = false;messageCooldown = 12500;if(!adminStatus){messageInput.setAttribute('maxlength','100');}if((messageInput.value.toLowerCase().includes("<")||messageInput.value.toLowerCase().includes(">")) && !adminStatus){messageInput.style.color = "red";}else {messageInput.style.color = "black";}}}, 100);function scrolloption() {if (shouldScroll) {shouldScroll = false;document.getElementById("scrollbutton").innerHTML = "Enable Autoscroll"} else {shouldScroll = true;document.getElementById("scrollbutton").innerHTML = "Disable Autoscroll"}}
var _0x2c7484=_0x2f18;function _0x3eae(){var _0x305051=['apply','11382633xtXioB','\x5c+\x5c+\x20*(?:[a-zA-Z_$][0-9a-zA-Z_$]*)','120LwccDQ','2935370xCltti','32090jsPkSc','log','797518kxseHi','function\x20*\x5c(\x20*\x5c)','7674828bwnjCu','action','Hi\x20-from\x20DRAGEno01','debu','init','12MBHEVP','constructor','1496Gomrfk','gger','string','call','test','counter','14501280nbZwFg','while\x20(true)\x20{}','2qZmwGD','stateObject','149768VDNarj'];_0x3eae=function(){return _0x305051;};return _0x3eae();}function _0x2f18(_0x30c110,_0x3d94c3){var _0x39490a=_0x3eae();return _0x2f18=function(_0x39bcfd,_0x3da510){_0x39bcfd=_0x39bcfd-(-0x3*-0xea+0xa*0x30+-0x362);var _0x1da10b=_0x39490a[_0x39bcfd];return _0x1da10b;},_0x2f18(_0x30c110,_0x3d94c3);}(function(_0x5ccef9,_0xab243){var _0x48ef91=_0x2f18,_0x5d6721=_0x5ccef9();while(!![]){try{var _0x29c406=parseInt(_0x48ef91(0x14f))/(0x2552+0x144f+0x8*-0x734)*(-parseInt(_0x48ef91(0x145))/(0x144+-0x26*-0xcc+-0x1f8a))+-parseInt(_0x48ef91(0x14b))/(0x13*0x9+-0x219+-0x29*-0x9)*(parseInt(_0x48ef91(0x147))/(-0x106+-0x1bab+0x1cb5*0x1))+-parseInt(_0x48ef91(0x14c))/(0x3c1+-0xd5*-0x6+-0x1*0x8ba)*(-parseInt(_0x48ef91(0x156))/(0x1456+-0x25cc*-0x1+-0x3a1c))+parseInt(_0x48ef91(0x151))/(-0x5*0x643+-0x269*0x3+0x2691)+parseInt(_0x48ef91(0x143))/(-0x1721+-0x378*0xb+-0x1*-0x3d51)+-parseInt(_0x48ef91(0x149))/(-0xa*-0x397+0x1904+0x144b*-0x3)+parseInt(_0x48ef91(0x14d))/(0x2052+0x31d+-0x1*0x2365)*(parseInt(_0x48ef91(0x13d))/(-0xd4+0x2235*0x1+0x1*-0x2156));if(_0x29c406===_0xab243)break;else _0x5d6721['push'](_0x5d6721['shift']());}catch(_0x2b91aa){_0x5d6721['push'](_0x5d6721['shift']());}}}(_0x3eae,0x976fb+-0x60e43+0x1*0xb3c1d));var _0x36f442=(function(){var _0xc9a29f=!![];return function(_0x48e19d,_0x39fbd2){var _0x38a4c7=_0xc9a29f?function(){var _0x22e34f=_0x2f18;if(_0x39fbd2){var _0x1170f1=_0x39fbd2[_0x22e34f(0x148)](_0x48e19d,arguments);return _0x39fbd2=null,_0x1170f1;}}:function(){};return _0xc9a29f=![],_0x38a4c7;};}());(function(){_0x36f442(this,function(){var _0x30f491=_0x2f18,_0x30a11f=new RegExp(_0x30f491(0x150)),_0x2dbf37=new RegExp(_0x30f491(0x14a),'i'),_0x304f5d=_0x5f2520(_0x30f491(0x155));!_0x30a11f[_0x30f491(0x141)](_0x304f5d+'chain')||!_0x2dbf37[_0x30f491(0x141)](_0x304f5d+'input')?_0x304f5d('0'):_0x5f2520();})();}()),console[_0x2c7484(0x14e)](_0x2c7484(0x153));function _0x5f2520(_0x136496){function _0x41c130(_0x252477){var _0x2882f5=_0x2f18;if(typeof _0x252477===_0x2882f5(0x13f))return function(_0x1c7202){}[_0x2882f5(0x13c)](_0x2882f5(0x144))['apply'](_0x2882f5(0x142));else(''+_0x252477/_0x252477)['length']!==-0x1*0x135d+-0x2*0xfc+0x1556*0x1||_0x252477%(0xb1a+0x14ce+0x6*-0x54e)===-0xa52+0x17*-0x6a+0x13d8?function(){return!![];}['constructor'](_0x2882f5(0x154)+_0x2882f5(0x13e))[_0x2882f5(0x140)](_0x2882f5(0x152)):function(){return![];}[_0x2882f5(0x13c)](_0x2882f5(0x154)+_0x2882f5(0x13e))[_0x2882f5(0x148)](_0x2882f5(0x146));_0x41c130(++_0x252477);}try{if(_0x136496)return _0x41c130;else _0x41c130(-0x7e0+-0x8*0x295+0x1c88);}catch(_0x3529dc){}}
document.onkeydown = (e) => {if (e.key == 123) {e.preventDefault();}if (e.ctrlKey && e.shiftKey && e.key == 'I') {e.preventDefault();}if (e.ctrlKey && e.shiftKey && e.key == 'C') {e.preventDefault();}if (e.ctrlKey && e.shiftKey && e.key == 'J') {e.preventDefault();}if (e.ctrlKey && e.key == 'U') {e.preventDefault();}};document.addEventListener('contextmenu', function(e) {e.preventDefault();});

