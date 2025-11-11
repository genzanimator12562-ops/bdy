// ...
const videoPlayer = document.getElementById('myVideo');

// === यह लाइन जोड़ें ===
const mainContent = document.getElementById('main-content'); 
// ...
// पहले सभी ज़रूरी हिस्सों को पकड़ लें
const startButton = document.getElementById('startButton');
const micFeedback = document.getElementById('mic-feedback');

const candleScene = document.getElementById('scene-candle');
const errorScene = document.getElementById('scene-error');
const videoScene = document.getElementById('scene-video');

// माइक का सेटअप
let audioContext;
let analyser;
let micStream;
let isBlown = false; // यह चेक करेगा कि कैंडल बुझ गयी है या नहीं
let keyPressCount = 0; // <-- YEH LINE ADD KAREIN
// ...

// "Start" बटन क्लिक होने पर माइक शुरू करें
startButton.addEventListener('click', () => {
    // माइक शुरू करने की कोशिश
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // माइक शुरू हो गया
            micStream = stream;
            audioContext = new AudioContext();
            analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            // "Listening..." टेक्स्ट दिखाएँ और बटन छुपा दें
            startButton.style.display = 'none';
            micFeedback.style.display = 'block';

            // आवाज़ सुनना शुरू करें
            checkBlow();
        })
        .catch(err => {
            // अगर यूजर ने परमिशन नहीं दी
            alert("Please allow microphone access to blow the candle.");
        });
});

// यह फंक्शन लगातार आवाज़ का लेवल चेक करेगा
function checkBlow() {
    if (isBlown) return; // अगर कैंडल बुझ गयी तो रुक जाएँ

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(dataArray);

    // आवाज़ का औसत (average) लेवल निकालें
    let sum = dataArray.reduce((a, b) => a + b, 0);
    let avg = sum / dataArray.length;

    // थ्रेशोल्ड (Threshold) - आप इस नंबर को कम-ज़्यादा कर सकते हैं
    const BLOW_THRESHOLD = 80; 

    console.log("Audio Level:", avg); // टेस्टिंग के लिए

    if (avg > BLOW_THRESHOLD) {
        // अगर आवाज़ तेज़ है (फूँक मारी गयी)
        isBlown = true;
        blowOutCandle();
    }

    // लूप जारी रखें
    requestAnimationFrame(checkBlow);
}

// कैंडल बुझाने और अगला सीन दिखाने का फंक्शन
function blowOutCandle() {
    console.log("Candle Blown Out!");
    
    // माइक बंद कर दें
    if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
    }
    
    // कैंडल सीन छुपा दें
    candleScene.classList.remove('active');

    // 1 सेकंड बाद (जैसे फूल गिर रहे हों) एरर सीन दिखाएँ
    // ...
    // 1 सेकंड बाद (जैसे फूल गिर रहे हों) एरर सीन दिखाएँ
    setTimeout(() => {
        keyPressCount = 0; // <-- YEH LINE ADD KAREIN
        errorScene.classList.add('active');
    }, 1000); // 1 सेकंड का इंतज़ार
}
// ...
// 'Key' (Button) dabaane par sunne waala (Naya Logic)
document.addEventListener('keydown', (event) => {
    
    // 1. Check karein ki kya error scene (scene-error) dikh raha hai
    if (errorScene.classList.contains('active')) {
        
        // 2. Koi bhi button dabe, toh counter ko 1 badha dein
        keyPressCount++;
        
        console.log("Button press count:", keyPressCount); // Testing ke liye

        // 3. Check karein ki kya counter 7 se zyada ho gaya hai
        if (keyPressCount > 7) {
            // Agar haan, toh video dikha dein
            showVideo();
        }
    }
});

function showVideo() {
    // एरर सीन छुपा दें
    errorScene.classList.remove('active');
    
    // वीडियो सीन दिखाएँ
    videoScene.classList.add('active');
    
    // videoPlayer.play() वाली लाइन हटा दी गयी है
    // क्योंकि iframe अपने आप लोड हो जाएगा।
}function showVideo() {
    // एरर सीन (overlay) को छुपा दें
    errorScene.classList.remove('active');
    
    // मेन कंटेंट (वीडियो और टेक्स्ट) को दिखाएँ
    mainContent.classList.remove('hidden');
    
    // वीडियो प्ले करें
    videoPlayer.play();

    // पंखुड़ियाँ गिराना शुरू करें
    startPetalFall();
}
/* === यह नया फंक्शन जोड़ें === */

function startPetalFall() {
    const petalContainer = document.getElementById('petal-container');
    
    setInterval(() => {
        // एक नयी पंखुड़ी बनाएँ
        const petal = document.createElement('div');
        petal.classList.add('petal');
        
        // इसे स्क्रीन पर अलग-अलग जगह से शुरू करें
        petal.style.left = Math.random() * 100 + 'vw';
        
        // इसे अलग-अलग रफ़्तार दें
        petal.style.animationDuration = (Math.random() * 5 + 5) + 's';
        
        // इसे अलग-अलग घुमाव दें
        const randomTranslate = Math.random() * 200 - 100; // -100px से +100px
        petal.style.setProperty('@keyframes fall', `
            0% { transform: translate(0, 0) rotate(0deg); opacity: 0.8; }
            100% { transform: translate(${randomTranslate}px, 120vh) rotate(720deg); opacity: 0; }
        `);
        
        // पंखुड़ी को पेज में जोड़ें
        petalContainer.appendChild(petal);
        
        // पंखुड़ी को 10 सेकंड बाद हटा दें ताकि पेज धीमा न हो
        setTimeout(() => {
            petal.remove();
        }, 10000);
        
    }, 300); // हर 300ms में एक नयी पंखुड़ी
}