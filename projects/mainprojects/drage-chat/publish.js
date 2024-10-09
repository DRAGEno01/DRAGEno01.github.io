import { dragechatServerVersion, dragechatAllowUsage } from "https://drageno01.github.io/version.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"; //signInAnonymously, 
import { getFirestore, addDoc, collection, onSnapshot, doc, getDocs, query, where, } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

let clientVersion = 0.00008;
if(dragechatServerVersion == clientVersion){
    document.getElementById("outofdateclient").style.display = "none";
}else {
    document.getElementById("outofdateclient").style.display = "block";
}
if(!dragechatAllowUsage){
    document.getElementById("usageshutdown").style.display = "block";
}else {
    document.getElementById("usageshutdown").style.display = "none";
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

let cookieforsession = getCookie("session")
if(cookieforsession == "" || cookieforsession == null || cookieforsession == false){
    document.cookie = `session=${true}; path=/`;
    window.location.reload(true);
}else {
    document.cookie = `session=${false}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
}

const firebaseConfig = {
    apiKey: "AIzaSyChVEPH5BqCy-mUzPx0vXhcKHEO56Qgv2M",
    authDomain: "drage-chat.firebaseapp.com",
    projectId: "drage-chat",
    storageBucket: "drage-chat.appspot.com",
    messagingSenderId: "946400520996",
    appId: "1:946400520996:web:3f7a6caf2bef6913dfa1b1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

auth.languageCode = 'en';
let staffEmails = ["drageno110@gmail.com"];
let testerEmails = ["sinxbax301@outlook.com"];
let vipEmails = ["drageno110@gmail.com", "b.drageno01@gmail.com", "sinxbax301@outlook.com"];
const date = new Date();
let authenticatedLogin = false;
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${day}-${month}-${year}`;
let setName = date.toJSON().slice(0, 19).replace(":", ".").replace(":", "").replace("-", "").replace("-", "").replace(".", "");

const provider = new GoogleAuthProvider();
const joinButton = document.getElementById("joinButton");
const usernameInput = document.getElementById("usernameInput");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const joinView = document.getElementById("joinView");
const chatsView = document.getElementById("chatsView");
const audioMuteButton = document.getElementById("audioMute");
const clientIdDisplay = document.getElementById("clientVersion");
if(clientVersion==dragechatServerVersion && dragechatAllowUsage){
    clientIdDisplay.style.color = "green";
}else {
    clientIdDisplay.style.color = "red";
}
clientIdDisplay.innerHTML = `Client Version: ${clientVersion} | Server Version: ${dragechatServerVersion} | Chat Usage Allowed: ${dragechatAllowUsage}`;

let messageCooldown = 12500;
let messages = [];
let specifiedUsername = "";
let userLoggedIn = false;
let uid;
let email;
let adminStatus = false;
let shouldScroll = true;
let datenow;
let tabFocused = true;
let newMessagesSinceTabNotFocused = 0;
let audioMuteStatus = false;
const regex = /\p{Extended_Pictographic}/ug;

function playSound(){
    const audio = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1233-elegant.mp3");
    audio.play();
};

audioMuteButton.addEventListener("click", () => {
    if(!audioMuteStatus){
        audioMuteStatus = true;
        document.getElementById("audioMute").innerHTML = "Unmute Audio";
    }else {
        audioMuteStatus = false;
        document.getElementById("audioMute").innerHTML = "Mute Audio";
    }
});

joinButton.addEventListener("click", () => {
    if(!(dragechatServerVersion == clientVersion)){
        alert("You can not use our platform until you update your client side!");
        return;
    }
    if(!dragechatAllowUsage){
        alert("You are unable to join the chat currently!");
        return;
    }
    specifiedUsername = usernameInput.value;
    if(regex.test(specifiedUsername)){
        alert("You have something in the username your not allowed to have.");
        return;
    }
    if (!specifiedUsername) {
        alert("Username cannot be empty");
        return;
    }

    signInWithPopup(auth, provider)
        .then(async (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            uid = user.uid;
            email = user.email;
            if(vipEmails.includes(email)){
                document.getElementById("patreonThanks").style.display = "block";
                if(testerEmails.includes(email)){
                    authenticatedLogin = true;
                    specifiedUsername = "<b style='color:green;'><u>"+specifiedUsername+"</u></b> 🪲💎✔️";
                    document.getElementById("staffButtons").style.display = "block";
                }else if (staffEmails.includes(email)) {
                    authenticatedLogin = true;
                    messageInput.setAttribute('maxlength','3000');
                    document.getElementById("body").style.backgroundColor = "#333";
                    document.getElementById("staffButtons").style.display = "block";
                    adminStatus = true;
                    specifiedUsername = "<b style='color:red;'><u>"+specifiedUsername+"</u></b> 🛠️💎✔️";
                }else {
                    if (specifiedUsername == "DRAGEno01" && adminStatus == false) {
                        specifiedUsername = Math.round(Math.random() * 100000);
                    };
                    specifiedUsername = "<span style='color:#17F1F4'>"+specifiedUsername+"</span> 💎";
                };
            }else {
                if(testerEmails.includes(email)){
                    authenticatedLogin = true;
                    specifiedUsername = "<b style='color:green;'><u>"+specifiedUsername+"</u></b> 🪲✔️";
                    document.getElementById("staffButtons").style.display = "block";
                }else if (staffEmails.includes(email)) {
                    authenticatedLogin = true;
                    messageInput.setAttribute('maxlength','3000');
                    document.getElementById("body").style.backgroundColor = "#333";
                    document.getElementById("staffButtons").style.display = "block";
                    adminStatus = true;
                    specifiedUsername = "<b style='color:red;'><u>"+specifiedUsername+"</u></b> 🛠️✔️";
                }else if(specifiedUsername == "DRAGEno01" && adminStatus == false) {
                    specifiedUsername = Math.round(Math.random() * 100000);
                }
            };
            document.getElementById("audioOptions").style.display = "block";
            joinView.classList.add("hidden");
            chatsView.classList.remove("hidden");
            userLoggedIn = true;
            await loadHistoricalMessages();
            await subscribeToNewMessages();
            writeMessagesArray();
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.log(errorCode, errorMessage);
            if (errorCode == "auth/user-disabled") {
                setTimeout(() => {
                    alert("This account is currently banned from our system.");
                }, 100);
            }
        });
});

sendButton.addEventListener("click", async () => {
    if (auth.currentUser) {
        auth.currentUser.reload().then(async user => {
            const message = messageInput.value;
            if (!message == "") {
                if((message.toLowerCase().includes("<")||message.toLowerCase().includes(">")) && !adminStatus){
                    alert("You are unable to send message with a HTML tag in it.");
                }else{
                    if(!adminStatus){
                        sendButton.style.display = "none";
                        setTimeout(() => {
                            sendButton.style.display = "block";
                        }, messageCooldown);
                    }
                    messageInput.value = "";
                    datenow = new Date();
                    const docRef = await addDoc(collection(db, "messages"), {
                        user: specifiedUsername,
                        message: message,
                        created: datenow,
                        uid: uid,
                        email: email,
                        staff: adminStatus,
                    });
                }
            }
        }).catch(error => {
            alert("You are currently unable to send message. Login again to continue.");
            window.location.href = window.location.href;
        });
    }

});

function subscribeToNewMessages() {
    const q = query(collection(db, "messages"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newMessages = [];
        querySnapshot.forEach((doc) => {
            newMessages.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        let existingMessageHash = {};
        for (let message of messages) {
            existingMessageHash[message.id] = true;
        }
        for (let message of newMessages) {
            if (!existingMessageHash[message.id]) {
                messages.push(message);
            }
        }
        let allowShowID = false;
        if (adminStatus == true) {
            allowShowID = true;
        }
        if(!tabFocused){
            newMessagesSinceTabNotFocused += 1;
            if(!audioMuteStatus){
                playSound();
            };
        }
        if (allowShowID) {
            writeMessagesArray(true);
        } else {
            writeMessagesArray(false);
        }
    });
}

async function loadHistoricalMessages() {
    messages = [];
    const querySnapshot = await getDocs(collection(db, "messages"));
    querySnapshot.forEach((doc) => {
        messages.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    console.log(messages);
    return messages.sort((a, b) => {
        if (a.created > b.created) {
            return 1;
        } else if (a.created < b.created) {
            return -1;
        } else {
            return 0;
        }
    });
};

function writeMessagesArray(arg) {
    const html = [];
    for (let message of messages) {
        if (arg == true) {
            html.push(messageTemplate(message.message, message.user, message.created, true, message.uid));
        } else {
            html.push(messageTemplate(message.message, message.user, message.created, false, message.uid));
        }

    }
    document.getElementById("messageList").innerHTML = html.join("");
    if (shouldScroll) {
        setTimeout(() => {
            document.getElementById('messageListdiv').scrollTop = (document.getElementById('messageListdiv').scrollHeight);
        }, 100);
    }
}

function messageTemplate(message, username, timestamp, showID, id) {
    if (shouldScroll) {
        setTimeout(() => {
            document.getElementById('messageListdiv').scrollTop = (document.getElementById('messageListdiv').scrollHeight);
        }, 100);
    }
    if (showID) {
        return `<li>
        <div class="flex space-x-2 pl-2 pt-2">
          <div class="flex flex-col">
            <div class="flex items-baseline space-x-2">
              <div class="text-sm font-bold">${username}</div>
              <div class="text-sm text-gray-400">${new Date(timestamp.seconds * 1000).toLocaleDateString() +
            " " +
            new Date(timestamp.seconds * 1000).toLocaleTimeString()
            }</div>
            </div>
            <div class="text-sm text-gray-500">${message}</div>
            <p class="showUserId" id="messageID">${id}</p>
          </div>
        </div>
      </li>`;
    } else {
        return `<li>
    <div class="flex space-x-2 pl-2 pt-2">
      <div class="flex flex-col">
        <div class="flex items-baseline space-x-2">
          <div class="text-sm font-bold">${username}</div>
          <div class="text-sm text-gray-400">${new Date(timestamp.seconds * 1000).toLocaleDateString() +
            " " +
            new Date(timestamp.seconds * 1000).toLocaleTimeString()
            }</div>
        </div>
        <div class="text-sm text-gray-500">${message}</div>
      </div>
    </div>
  </li>`;
    }

}

document.getElementById("messageListdiv").setAttribute('scrolling', 'yes');

setInterval(() => {
    
    if(!authenticatedLogin){
        adminStatus = false;
        messageCooldown = 12500;
        if(!adminStatus){
            messageInput.setAttribute('maxlength','100');
        }
        if((messageInput.value.toLowerCase().includes("<")||messageInput.value.toLowerCase().includes(">")) && !adminStatus){
            messageInput.style.color = "red";
        }else {
            messageInput.style.color = "black";
        }
    }
    if(newMessagesSinceTabNotFocused>0){
        document.title = `(${newMessagesSinceTabNotFocused}) DRAGE Chat`;
    }else {
        document.title = `DRAGE Chat`;
    }
    if(tabFocused){
        newMessagesSinceTabNotFocused = 0;
    }
}, 100);

function scrolloption() {
    if (shouldScroll) {
        shouldScroll = false;
        document.getElementById("scrollbutton").innerHTML = "Enable Autoscroll";
    } else {
        shouldScroll = true;
        document.getElementById("scrollbutton").innerHTML = "Disable Autoscroll";
    }
}

window.addEventListener('focus', function () {
    tabFocused = true;
});

window.addEventListener('blur', function () {
    tabFocused = false;
});

setTimeout(() => {
    window.location.reload(true);
}, (60000*60));
