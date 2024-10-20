/*
    -[ Welcome to the DRAGE-Chat Code ]-
    Please do not use this to learn coding, the code is very messy.
    This code is made by DRAGEno01, and is under copyright.
    Copyright: [CC-BY-NC-ND] (This license enables reusers to copy and distribute the material in any medium or format in unadapted form only, for noncommercial purposes only, and only so long as attribution is given to the creator.)
*/

//  Imports
import { dragechatServerVersion, dragechatAllowUsage } from "https://drageno01.github.io/version.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"; //signInAnonymously, 
import { getFirestore, addDoc, collection, onSnapshot, doc, getDocs, query, where, } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Variable Declerations
let date = new Date();
let clientVersion = 0.00013;
let chatAllowUsage = dragechatAllowUsage;
let staffUID = ["tgtee2L2iKhvXznmgzAx9u3ApKi1"];
let testerUID = ["Sq3kcDSwZQVGSW4jmQ56r788GOv2"];
let vipUID = ["tgtee2L2iKhvXznmgzAx9u3ApKi1", "n37sgpejBkW8768m6cyjgCf47sA2", "Sq3kcDSwZQVGSW4jmQ56r788GOv2"];
let dragecsUID = ["tgtee2L2iKhvXznmgzAx9u3ApKi1", "jWbwKwxqC5cXTD9xEKWblHQBcuh2"];
let allowHTMLtags = ["tgtee2L2iKhvXznmgzAx9u3ApKi1", "Sq3kcDSwZQVGSW4jmQ56r788GOv2"];
let authenticatedLogin = false;
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${day}-${month}-${year}`;
let setCollectionName = date.toJSON().slice(0, 19).replace(":", ".").replace(":", "").replace("-", "").replace("-", "").replace(".", "");
let messageCooldown = 5000;
let ableToSendMessage = true;
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
let shownLivestreamMessage = false;
let channelToCheck = "DRAGEno01"
let cookieforsession = getCookie("session")
let liveCheck = false;
const provider = new GoogleAuthProvider();
const joinButton = document.getElementById("joinButton");
const usernameInput = document.getElementById("usernameInput");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const joinView = document.getElementById("joinView");
const chatsView = document.getElementById("chatsView");
const audioMuteButton = document.getElementById("audioMute");
const clientIdDisplay = document.getElementById("clientVersion");
const firebaseConfig = { apiKey: "AIzaSyChVEPH5BqCy-mUzPx0vXhcKHEO56Qgv2M", authDomain: "drage-chat.firebaseapp.com", projectId: "drage-chat", storageBucket: "drage-chat.appspot.com", messagingSenderId: "946400520996", appId: "1:946400520996:web:3f7a6caf2bef6913dfa1b1" }
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const regex = /\p{Extended_Pictographic}/ug;
const regexb = /[\xCC\xCD]/;
auth.languageCode = 'en';

//  Starter IF Statements

if (dragechatServerVersion == clientVersion) {
    document.getElementById("outofdateclient").style.display = "none";
} else {
    document.getElementById("outofdateclient").style.display = "block";
}

if (!chatAllowUsage) {
    document.getElementById("usageshutdown").style.display = "block";
} else {
    document.getElementById("usageshutdown").style.display = "none";
}

if (cookieforsession == "" || cookieforsession == null || cookieforsession == false) {
    document.cookie = `session=${true}; path=/`;
    window.location.reload(true);
} else {
    document.cookie = `session=${false}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
}

if (clientVersion == dragechatServerVersion && chatAllowUsage) {
    clientIdDisplay.style.color = "green";
} else {
    clientIdDisplay.style.color = "red";
}

if (!(dragechatServerVersion == clientVersion) || !chatAllowUsage) {
    document.getElementById("joinButton").style.display = "none";
}

//  Standard Code

clientIdDisplay.innerHTML = `Client Version: ${clientVersion} | Server Version: ${dragechatServerVersion} | Chat Usage Allowed: ${chatAllowUsage}`;
document.getElementById("messageListdiv").setAttribute('scrolling', 'yes');

audioMuteButton.addEventListener("click", () => {
    if (!audioMuteStatus) {
        audioMuteStatus = true;
        document.getElementById("audioMute").innerHTML = "Unmute Audio";
    } else {
        audioMuteStatus = false;
        document.getElementById("audioMute").innerHTML = "Mute Audio";
    }
});

joinButton.addEventListener("click", () => {
    specifiedUsername = usernameInput.value;
    if (!specifiedUsername) {
        alert("Username cannot be empty");
        return;
    } else if (regex.test(specifiedUsername)) {
        alert("You have something in the username your not allowed to have.");
        return;
    } else {
        joinChat()
    }
});

messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (ableToSendMessage) {
            sendMessage()
        }
    }
});

sendButton.addEventListener("click", async () => {
    if (ableToSendMessage) {
        sendMessage()
    }
});

setInterval(() => {
    if (!authenticatedLogin) {
        adminStatus = false;
        messageCooldown = 5000;
        if (!adminStatus) {
            messageInput.setAttribute('maxlength', '100');
        }
        if (testerUID.includes(uid)) {
            messageInput.setAttribute('maxlength', '300');
        }
        if (vipUID.includes(uid) && !(staffUID.includes(uid) || testerUID.includes(uid))) {
            messageInput.setAttribute('maxlength', '150')
        }
        if ((messageInput.value.toLowerCase().includes("<") || messageInput.value.toLowerCase().includes(">")) && !adminStatus) {
            messageInput.style.color = "red";
        } else {
            messageInput.style.color = "black";
        }
    }
    if (newMessagesSinceTabNotFocused > 0) {
        document.title = `(${newMessagesSinceTabNotFocused}) DRAGE Chat`;
    } else {
        document.title = `DRAGE Chat`;
    }
    if (tabFocused) {
        newMessagesSinceTabNotFocused = 0;
    }
}, 100);

window.addEventListener('focus', function () {
    tabFocused = true;
});

window.addEventListener('blur', function () {
    tabFocused = false;
});

setTimeout(() => {
    let counter = 0;
    if (!tabFocused) {
        counter += 1;
        if (counter > (60 * 10)) {
            window.location.reload(true);
        }
    }
    if (tabFocused) {
        counter = 0;
    }
}, 1000);

document.addEventListener('DOMContentLoaded', function () {
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.');
        return;
    }

    if (Notification.permission !== 'granted')
        Notification.requestPermission();
});

setInterval(() => {
    if (!ableToSendMessage) {
        if (!adminStatus) {
            sendButton.style.display = "none";
        }
    } else {
        sendButton.style.display = "block";
    }
}, 100);

setInterval(() => {
    check(channelToCheck)
    if (liveCheck) {
        document.getElementById("twitchlive").style.display = "block";
    } else {
        document.getElementById("twitchlive").style.display = "none";
    }
}, 7500);

//  Functions

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function playSound() {
    const audio = new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1233-elegant.mp3");
    audio.play();
};

function joinChat() {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            uid = user.uid;
            email = user.email;

            chatBadges()
            extraStaffFeatures()

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
}

function sendMessage() {
    if (auth.currentUser) {
        auth.currentUser.reload().then(async user => {
            const message = messageInput.value;
            if (!message == "") {
                if ((message.toLowerCase().includes("<") || message.toLowerCase().includes(">")) && !(allowHTMLtags.includes(uid))) {
                    alert("You are unable to send message with a HTML tag in it.");
                } else {
                    if ((allowHTMLtags.includes(uid) && !(staffUID.includes(uid))) && (message.toLowerCase().includes("img") && message.toLowerCase().includes("src="))) {
                        alert("You are not allowed to send messages the that tag.")
                    } else {
                        sendingMessageCooldownTrigger()
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
            }
        }).catch(error => {
            alert("You are currently unable to send message. You will need to login again to continue using DRAGE-Chat.");
            window.location.href = window.location.href;
        });
    }
}

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
                if (!tabFocused) {
                    notifyOfNewMessage(message.message);
                }
            }
        }
        let allowShowID = false;
        if (adminStatus == true) {
            allowShowID = true;
        }
        if (!tabFocused) {
            newMessagesSinceTabNotFocused += 1;
            if (!audioMuteStatus) {
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
        setTimeout(() => {
            document.getElementById('messageListdiv').scrollTop = (document.getElementById('messageListdiv').scrollHeight);
        }, 200);
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

function scrolloption() {
    if (shouldScroll) {
        shouldScroll = false;
        document.getElementById("scrollbutton").innerHTML = "Enable Autoscroll";
    } else {
        shouldScroll = true;
        document.getElementById("scrollbutton").innerHTML = "Disable Autoscroll";
    }
}

function check(chan) {
    let a = fetch(`https://decapi.me/twitch/uptime/${chan}`, { method: 'GET' }).then(response => response.text().then(function (text) {
        if (text.includes("is offline")) {
            liveCheck = false;
            if (shownLivestreamMessage) {
                shownLivestreamMessage = false;
            }
        } else if (text.includes(",")) {
            liveCheck = true;
            if (!shownLivestreamMessage) {
                shownLivestreamMessage = true;
                notifyOfLivestream(chan)
            }
        }
    }))
}

function sendingMessageCooldownTrigger() {
    if (!adminStatus) {
        ableToSendMessage = false;
        setTimeout(() => {
            ableToSendMessage = true;
        }, messageCooldown);
    }
}

function chatBadges() {
    let patreon = false;
    let dragecs = false;
    let tester = false;
    let staff = false;
    if (dragecsUID.includes(uid)) {
        dragecs = true;
    }
    if (vipUID.includes(uid)) {
        patreon = true;
    }
    if (testerUID.includes(uid)) {
        tester = true;
    }
    if (staffUID.includes(uid)) {
        staff = true;
    }
    if (staff) {
        specifiedUsername = "<b style='color:red;'><u>" + specifiedUsername + "</u></b> ";
    } else if (tester) {
        if (specifiedUsername == "DRAGEno01") {
            specifiedUsername = "<b style='color:green;'><u>" + Math.round(Math.random() * 100000) + "</u></b> ";
        } else {
            specifiedUsername = "<b style='color:green;'><u>" + specifiedUsername + "</u></b> ";
        }
    } else if (dragecs) {
        if (specifiedUsername == "DRAGEno01") {
            specifiedUsername = "<b style='color:orange;'><u>" + Math.round(Math.random() * 100000) + "</u></b> ";
        } else {
            specifiedUsername = "<b style='color:orange;'><u>" + specifiedUsername + "</u></b> ";
        }
    } else if (patreon) {
        if (specifiedUsername == "DRAGEno01") {
            specifiedUsername = "<span style='color:#17F1F4'>" + Math.round(Math.random() * 100000) + "</span> ";
        } else {
            specifiedUsername = "<span style='color:#17F1F4'>" + specifiedUsername + "</span> ";
        }
    } else {
        if (specifiedUsername == "DRAGEno01") {
            specifiedUsername = Math.round(Math.random() * 100000);
        } else {
            specifiedUsername = specifiedUsername;
        }
    }
    if (staff) {
        specifiedUsername = specifiedUsername + "🛠️"
    }
    if (tester) {
        specifiedUsername = specifiedUsername + "🪲"
    }
    if (dragecs) {
        specifiedUsername = specifiedUsername + "🔥"
    }
    if (patreon) {
        specifiedUsername = specifiedUsername + "💎"
    }
    if (staff || tester || dragecs) {
        specifiedUsername = specifiedUsername + "✔️"
    }
}

function extraStaffFeatures() {
    let patreon = false;
    let dragecs = false;
    let tester = false;
    let staff = false;
    if (dragecsUID.includes(uid)) {
        dragecs = true;
    }
    if (vipUID.includes(uid)) {
        patreon = true;
    }
    if (testerUID.includes(uid)) {
        tester = true;
    }
    if (staffUID.includes(uid)) {
        staff = true;
    }

    if (staff) {
        authenticatedLogin = true;
        messageInput.setAttribute('maxlength', '3000');
        document.getElementById("body").style.backgroundColor = "#333";
        document.getElementById("staffButtonOne").style.display = "block";
        document.getElementById("staffButtonTwo").style.display = "block";
        adminStatus = true;
    } else if (tester) {
        document.getElementById("staffButtonOne").style.display = "block";
        document.getElementById("staffButtonTwo").style.display = "block";
        messageInput.setAttribute('maxlength', '300');
        authenticatedLogin = true;
    }
    if (patreon) {
        document.getElementById("patreonThanks").style.display = "block";
        messageInput.setAttribute('maxlength', '150');
    }
}

function notifyOfNewMessage(message) {
    let shownMessage = message
    if (message.includes("<") || message.includes(">")) {
        shownMessage = "[MESSAGE FROM STAFF]"
    }
    if (Notification.permission !== 'granted')
        Notification.requestPermission();
    else {
        var notification = new Notification('New Message - DRAGE Chat', {
            icon: 'https://yt3.googleusercontent.com/UqMYqkzSVzqj9h_Fv3cj-P60co_6nbuEuaEuUiC5d3Bf9IyoHKDaZi584ICJnqsNzZ9SHN6UTg=s900-c-k-c0x00ffffff-no-rj',
            body: `${shownMessage}`,
        });
        notification.onclick = function () {
            window.open('https://drageno01.github.io/?chat');
        };
    }
}

function notifyOfLivestream(channel) {
    if (Notification.permission !== 'granted')
        Notification.requestPermission();
    else {
        var notification = new Notification(`Live Notification - DRAGE Chat`, {
            icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968819.png',
            body: `Check out this livestream from ${channel} on Twitch.`,
        });
        notification.onclick = function () {
            window.open(`https://twitch.tv/${channel}`);
        };
    }
}
