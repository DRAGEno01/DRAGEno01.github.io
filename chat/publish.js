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
import { getFirestore, addDoc, collection, onSnapshot, doc, getDocs, query, where, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Variable Declerations
let date = new Date();
let clientVersion = 0.00015;
let chatAllowUsage = dragechatAllowUsage;
let staffUID = ["tgtee2L2iKhvXznmgzAx9u3ApKi1", "uuftLej5XYUUMEldjqrb1H061Y73"];
let testerUID = ["Sq3kcDSwZQVGSW4jmQ56r788GOv2"];
let vipUID = ["tgtee2L2iKhvXznmgzAx9u3ApKi1", "n37sgpejBkW8768m6cyjgCf47sA2", "Sq3kcDSwZQVGSW4jmQ56r788GOv2"];
let dragecsUID = ["tgtee2L2iKhvXznmgzAx9u3ApKi1", "jWbwKwxqC5cXTD9xEKWblHQBcuh2"];
let allowHTMLtags = ["tgtee2L2iKhvXznmgzAx9u3ApKi1", "Sq3kcDSwZQVGSW4jmQ56r788GOv2", "uuftLej5XYUUMEldjqrb1H061Y73"];
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
let lastUsername = getCookie("lastUsername")
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
const imageButton = document.getElementById("imageButton")
const firebaseConfig = { apiKey: "AIzaSyChVEPH5BqCy-mUzPx0vXhcKHEO56Qgv2M", authDomain: "drage-chat.firebaseapp.com", projectId: "drage-chat", storageBucket: "drage-chat.appspot.com", messagingSenderId: "946400520996", appId: "1:946400520996:web:3f7a6caf2bef6913dfa1b1" }
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const regex = /\p{Extended_Pictographic}/ug;
const regexb = /[\xCC\xCD]/;
auth.languageCode = 'en';

// Add these near the top with other variable declarations
const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
let isDarkMode = getCookie('darkMode') !== null ? 
    getCookie('darkMode') === 'true' : 
    darkModeMediaQuery.matches;

// Add these near other variable declarations
let currentUser = null;

// Modify the initialization code to check conditions
auth.onAuthStateChanged((user) => {
    if (user) {
        // Add version and usage checks
        if (dragechatServerVersion !== clientVersion || !chatAllowUsage) {
            logout();
            return;
        }

        currentUser = user;
        uid = user.uid;
        email = user.email;
        
        // Only auto-join if we have a saved username
        const savedUsername = getCookie('lastUsername');
        if (savedUsername && !userLoggedIn) {
            specifiedUsername = savedUsername;
            autoJoinChat();
        }
    }
});

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

if (!(lastUsername == null || lastUsername == undefined) && !(lastUsername.includes("<"))) {
    usernameInput.value = lastUsername
}
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
        document.cookie = `lastUsername=${specifiedUsername}`
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

imageButton.addEventListener("click", () => {
    document.getElementById("id02").style.display = "block";
    document.getElementById("imagestab").click();
})

document.querySelectorAll(".spec").forEach(element => {
    element.addEventListener("click", (e) => {
        document.getElementById("specclosebtn").click();
        let styled = e.target.currentStyle || window.getComputedStyle(e.target, false)
        let backgroundImage = styled.backgroundImage.slice(4, -1).replace(/"/g, "");
        sendSpecialItem(backgroundImage)
    })
})

setInterval(() => {
    if (adminStatus) {
        messageInput.setAttribute('maxlength', '5000')
    }
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

window.addEventListener('online', () => {
    document.getElementById("internetcheck").style.display = "none";
});
window.addEventListener('offline', () => {
    document.getElementById("internetcheck").style.display = "block";
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

// Add this with your other event listeners
document.getElementById('themeToggle').addEventListener('click', toggleDarkMode);

// Add this with your other event listeners (near the top where other button listeners are defined)
document.getElementById('logoutButton').addEventListener("click", async () => {
    await logout();
});

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
            document.getElementById('id01').style.display = 'block'
            setTimeout(() => {
                document.getElementById('messageListdiv').scrollTop = (document.getElementById('messageListdiv').scrollHeight)+1000;
            }, 1250);
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

// Make toggleReaction globally available
window.toggleReaction = async function(messageId, emoji) {
    if (!auth.currentUser) return;
    
    try {
        const messageRef = doc(db, "messages", messageId);
        const messageDoc = await getDoc(messageRef);
        
        if (!messageDoc.exists()) {
            console.error("Message not found");
            return;
        }

        const reactions = messageDoc.data().reactions || {
            "👍": [],
            "❤️": [],
            "😄": [],
            "😮": [],
            "🎉": []
        };
        
        const userUid = auth.currentUser.uid;
        
        // If user has already reacted with this emoji, remove it
        if (reactions[emoji]?.includes(userUid)) {
            reactions[emoji] = reactions[emoji].filter(uid => uid !== userUid);
        } else {
            // Add the new reaction
            if (!reactions[emoji]) reactions[emoji] = [];
            reactions[emoji].push(userUid);
        }

        await updateDoc(messageRef, { reactions });
        console.log("Reaction updated successfully", reactions); // Debug log
    } catch (error) {
        console.error("Error updating reaction:", error);
    }
}

// Update the sendMessage function to include reactions initialization
async function sendMessage() {
    messageInput.readOnly = true;
    if (auth.currentUser) {
        auth.currentUser.reload().then(async user => {
            const message = messageInput.value;
            if (!message == "") {
                if ((message.toLowerCase().includes("<") || message.toLowerCase().includes(">")) && !(allowHTMLtags.includes(uid))) {
                    alert("You are unable to send message with a HTML tag in it.");
                    messageInput.readOnly = false;
                } else {
                    if ((allowHTMLtags.includes(uid) && !(staffUID.includes(uid))) && (message.toLowerCase().includes("img") && message.toLowerCase().includes("src="))) {
                        alert("You are not allowed to send messages the that tag.")
                        messageInput.readOnly = false;
                    } else {
                        sendingMessageCooldownTrigger()
                        messageInput.value = "";
                        datenow = new Date();
                        const docRef = await addDoc(collection(db, "messages"), {
                            user: specifiedUsername,
                            message: message,
                            created: datenow,
                            uid: uid,
                            email: "{no longer supported}",
                            staff: adminStatus,
                            reactions: {
                                "👍": [],
                                "❤️": [],
                                "😄": [],
                                "😮": [],
                                "🎉": []
                            }
                        });
                    }
                }
            }
        })
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
        
        // Sort messages by creation date
        messages = newMessages.sort((a, b) => {
            return a.created.seconds - b.created.seconds;
        });
        
        // Check for mentions in new messages
        const currentUsername = specifiedUsername.replace(/<[^>]*>/g, '');
        const mentionRegex = new RegExp(`@${currentUsername}\\b`, 'i');
        
        const hasNewMention = newMessages.some(msg => 
            mentionRegex.test(msg.message) && 
            msg.uid !== auth.currentUser.uid
        );
        
        if (!tabFocused) {
            newMessagesSinceTabNotFocused += 1;
            if (!audioMuteStatus && (hasNewMention || !tabFocused)) {
                playSound();
                if (hasNewMention) {
                    notifyOfNewMessage(`Someone mentioned you: @${currentUsername}`);
                }
            }
        }
        
        writeMessagesArray(adminStatus);
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
    // console.log(messages);
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

// Make deleteMessage globally available
window.deleteMessage = async function(messageId) {
    if (!adminStatus) {
        console.log("Not an admin, cannot delete");
        return;
    }
    
    try {
        const messageRef = doc(db, "messages", messageId);
        await updateDoc(messageRef, {
            message: "<i style='color: red;'>[Message Deleted by Admin]</i>"
        });
        console.log("Message deleted successfully");
    } catch (error) {
        console.error("Error deleting message: ", error);
        alert("Error deleting message. Please try again.");
    }
}

// Update createAnimatedMessage to use the global function
function createAnimatedMessage(message, username, timestamp, showID, id) {
    const li = document.createElement('li');
    li.className = 'message-item slide-up px-3 py-1.5';

    // Only show delete button for admins
    const deleteButton = adminStatus ? 
        `<button onclick="deleteMessage('${message.id}')" class="text-red-500 hover:text-red-700 text-sm ml-2 transition-colors duration-200">
            <span class="font-bold">🗑️</span>
        </button>` : 
        '';

    // Initialize reactions if they don't exist
    const reactions = message.reactions || {
        "👍": [],
        "❤️": [],
        "😄": [],
        "😮": [],
        "🎉": []
    };

    // Create reactions HTML with counts
    const reactionsHtml = `
        <div class="flex gap-1 mt-1">
            ${Object.entries(reactions).map(([emoji, users]) => `
                <button onclick="toggleReaction('${message.id}', '${emoji}')" 
                    class="text-sm hover:opacity-100 ${users.includes(uid) ? 'opacity-100' : 'opacity-50'}">
                    ${emoji}${users.length > 0 ? users.length : ''}
                </button>
            `).join('')}
        </div>
    `;

    li.innerHTML = `
        <div>
            <div class="flex items-center gap-2">
                <span class="font-bold text-base">${message.user}</span>
                <span class="text-xs text-gray-400">${new Date(message.created.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                ${deleteButton}
            </div>
            <div class="text-sm">${message.message}</div>
            ${reactionsHtml}
            ${showID ? `<div class="text-xs text-gray-400 mt-0.5" id="messageID">${message.uid}</div>` : ''}
        </div>
    `;

    return li;
}

// Update the writeMessagesArray function
function writeMessagesArray(arg) {
    const messageList = document.getElementById("messageList");
    messageList.innerHTML = '';
    
    messages.forEach(message => {
        if (!message || !message.id) {
            console.log("Invalid message:", message);
            return;
        }
        const messageElement = createAnimatedMessage(message, null, null, arg, null);
        messageList.appendChild(messageElement);
        
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 10);
    });

    if (shouldScroll) {
        const messageListDiv = document.getElementById('messageListdiv');
        messageListDiv.style.scrollBehavior = 'smooth';
        messageListDiv.scrollTop = messageListDiv.scrollHeight;
        
        setTimeout(() => {
            messageListDiv.style.scrollBehavior = 'auto';
        }, 300);
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
    messageInput.readOnly = false;
    if (!adminStatus) {
        ableToSendMessage = false;
        setTimeout(() => {
            ableToSendMessage = true;
        }, messageCooldown);
    }
}

function sendSpecialItemCooldownTrigger(){
    if(!adminStatus){
        imageButton.style.display = "none";
        setTimeout(() => {
            imageButton.style.display = "block";
        }, (messageCooldown*3));
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
        adminStatus = true;
        authenticatedLogin = true;
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
    // 🛠️🪲🔥💎✔️
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
        adminStatus = true;
        authenticatedLogin = true;
        messageInput.setAttribute('maxlength', '5000');
        document.getElementById("staffButtonOne").style.display = "block";
        document.getElementById("staffButtonTwo").style.display = "block";

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

async function sendSpecialItem(item) {
    sendSpecialItemCooldownTrigger()
    datenow = new Date();
    const docRef = await addDoc(collection(db, "messages"), {
        user: specifiedUsername,
        message: "<img src='"+item+"' style='width: 180px;'>",
        created: datenow,
        uid: uid,
        email: "{no longer supported}",
        staff: adminStatus,
    });
}

// When showing joinView
document.getElementById('joinView').classList.add('show');

// When showing chatsView
document.getElementById('chatsView').classList.add('show');

// For alerts, modify how they're displayed
function showAlert(alertId) {
    const alert = document.getElementById(alertId);
    alert.style.display = 'block';
    // Small delay to ensure display:block is processed before adding show class
    setTimeout(() => {
        alert.classList.add('show');
    }, 10);
}

// Add this function with your other functions
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.cookie = `darkMode=${isDarkMode}; path=/; max-age=31536000`; // Expires in 1 year
    applyTheme();
}

function applyTheme() {
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// Add this to your initialization code (after variable declarations)
applyTheme();

// Add this new function for auto-joining
async function autoJoinChat() {
    chatBadges();
    extraStaffFeatures();

    document.getElementById("audioOptions").style.display = "block";
    joinView.classList.add("hidden");
    chatsView.classList.remove("hidden");
    userLoggedIn = true;
    await loadHistoricalMessages();
    await subscribeToNewMessages();
    writeMessagesArray();
    document.getElementById('id01').style.display = 'block';
    setTimeout(() => {
        document.getElementById('messageListdiv').scrollTop = (document.getElementById('messageListdiv').scrollHeight) + 1000;
    }, 1250);
}

// Update the logout function to handle forced logouts
async function logout() {
    try {
        await auth.signOut();
        currentUser = null;
        userLoggedIn = false;
        
        // Clear cookies
        document.cookie = 'lastUsername=; Max-Age=0; path=/;';
        
        // Reset UI
        joinView.classList.remove("hidden");
        chatsView.classList.add("hidden");
        document.getElementById("audioOptions").style.display = "none";
        
        // Clear messages
        messages = [];
        document.getElementById("messageList").innerHTML = '';
        
        // Show appropriate message for forced logout
        if (dragechatServerVersion !== clientVersion) {
            alert("You have been logged out due to a version mismatch. Please refresh the page.");
        } else if (!chatAllowUsage) {
            alert("You have been logged out because chat usage is currently disabled.");
        }
        
        // Reload page to reset all states
        window.location.reload();
    } catch (error) {
        console.error("Error during logout:", error);
        alert("There was an error logging out. Please try again.");
    }
}

// Add this function to show the reaction picker
function showReactionPicker(messageId) {
    const picker = document.createElement('div');
    picker.className = 'reaction-picker fixed bottom-20 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-50';
    picker.innerHTML = `
        <div class="flex space-x-2">
            <button onclick="addReaction('${messageId}', '👍')" class="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded">👍</button>
            <button onclick="addReaction('${messageId}', '❤️')" class="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded">❤️</button>
            <button onclick="addReaction('${messageId}', '😄')" class="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded">😄</button>
            <button onclick="addReaction('${messageId}', '😮')" class="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded">😮</button>
            <button onclick="addReaction('${messageId}', '🎉')" class="hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded">🎉</button>
        </div>
    `;
    
    // Remove any existing picker
    const existingPicker = document.querySelector('.reaction-picker');
    if (existingPicker) {
        existingPicker.remove();
    }
    
    document.body.appendChild(picker);
    
    // Close picker when clicking outside
    document.addEventListener('click', function closePicker(e) {
        if (!picker.contains(e.target) && !e.target.closest('.add-reaction-btn')) {
            picker.remove();
            document.removeEventListener('click', closePicker);
        }
    });
}

// Add this function to handle adding reactions
async function addReaction(messageId, emoji) {
    await toggleReaction(messageId, emoji);
    const picker = document.querySelector('.reaction-picker');
    if (picker) {
        picker.remove();
    }
}


