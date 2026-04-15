const soundCorrect = new Audio('correct.mp3');
const soundWrong = new Audio('wrong.mp3');
const soundBackground = new Audio('bg.mp3'); 
soundBackground.loop = true;
soundBackground.volume = 0.2;

const allQuestions = {
	'Java': [
        { q: "رتب الكود لتعريف متغير صحيح x قيمته 10", correct: "intx=10;", options: ["int", "x", "=", "10", ";", "String", "float", ":"] },
        { q: "رتب كود طباعة كلمة Hi", correct: "System.out.println(\"Hi\");", options: ["System.out.println", "(", "\"Hi\"", ")", ";", "print", "out", ":"] },
        { q: "رتب الكود لزيادة قيمة المتغير x بواحد", correct: "x=x+1;", options: ["x", "=", "x", "+", "1", ";", "y", "-"] },
        { q: "رتب الشرط التالي (إذا كان x أكبر من 5)", correct: "if(x>5)", options: ["if", "(", "x", ">", "5", ")", "when", "{"] },
        { q: "رتب كود لجمع رقمين (y + z) وتخزينهم في sum", correct: "intsum=y+z;", options: ["int", "sum", "=", "y", "+", "z", ";", "add"] }
    ],
    'HTML': [
        { q: "رتب وسم العنوان الرئيسي لموقعك", correct: "<h1>مرحباً</h1>", options: ["<h1>", "مرحباً", "</h1>", "<body>", "<head>", "<h2>"] },
        { q: "رتب وسم إضافة رابط لموقع جوجل", correct: "<ahref=\"google.com\">جوجل</a>", options: ["<a", "href=", "\"google.com\"", ">", "جوجل", "</a>", "<link>", "src="] },
        { q: "رتب وسم إدراج صورة باسم logo.png", correct: "<imgsrc=\"logo.png\">", options: ["<img", "src=", "\"logo.png\"", ">", "href=", "</img>", "<image>"] },
        { q: "رتب وسم حاوية محتوى (div) بداخلها نص", correct: "<div>محتوى</div>", options: ["<div>", "محتوى", "</div>", "<span>", "<section>", "<p>"] },
        { q: "رتب وسم زر مكتوب عليه (إرسال)", correct: "<button>إرسال</button>", options: ["<button>", "إرسال", "</button>", "submit", "<input>", "type="] }
    ],
    'CSS': [
        { q: "رتب خاصية جعل لون النص أحمر", correct: "color:red;", options: ["color", ":", "red", ";", "font-color", "text-color", "="] },
        { q: "رتب خاصية جعل حجم الخط 20 بكسل", correct: "font-size:20px;", options: ["font-size", ":", "20px", ";", "text-size", "width", "size"] },
        { q: "رتب خاصية إضافة تباعد داخلي (padding) 10 بكسل", correct: "padding:10px;", options: ["padding", ":", "10px", ";", "margin", "11px", "border", "space"] },
        { q: "رتب خاصية جعل النص في المنتصف", correct: "text-align:center;", options: ["text-align", ":", "center", ";", "middle", "justify", "align"] },
        { q: "رتب خاصية تغيير لون الخلفية للأزرق", correct: "background-color:blue;", options: ["background-color", ":", "blue", ";", "bgcolor", "color", "fill"] }
    ]
};

let timeLeft, timerId, score, currentQuestionIndex, questions;

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'flex';

const backBtn = document.getElementById('back-nav-btn');
    if (pageId === 'language-page' || pageId === 'play-page') {
        backBtn.style.display = 'block';
    } else {
        backBtn.style.display = 'none';
    }
}

function saveNameAndContinue() {
    const nameInput = document.getElementById("user-name-input");
    const name = nameInput.value.trim();
    if (!name) { alert("من فضلك أدخل اسمك أولاً!"); return; }
    
    // عرض رسالة الترحيب والاسم
    document.getElementById("welcome-msg").innerText = `مرحباً بك يا ${name}! 👋`;
    document.getElementById("playerName").innerText = "👤 اللاعب: " + name;
    
    showPage('language-page');
    // تشغيل الصوت بعد تفاعل المستخدم
    soundBackground.play().catch(() => console.log("الصوت بانتظار اختيار اللغة"));
}

function startGame(lang) {
    questions = allQuestions[lang];
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("score").innerText = score;
    showPage('play-page');
    loadQuestion();
    startTimer();
    
    // تفعيل السحب والإفلات
    new Sortable(document.getElementById('blocks'), { group: 'shared', animation: 150 });
    new Sortable(document.getElementById('drop-area'), { group: 'shared', animation: 150 });
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) { finishGame(true); return; }
    
    const qData = questions[currentQuestionIndex];
    document.getElementById("question").innerText = qData.q;
    const blocksContainer = document.getElementById("blocks");
    const dropArea = document.getElementById("drop-area");
    
    blocksContainer.innerHTML = ''; dropArea.innerHTML = '';
    
    [...qData.options].sort(() => Math.random() - 0.5).forEach(opt => {
        const span = document.createElement("span");
        span.className = "game-block"; span.innerText = opt;
        blocksContainer.appendChild(span);
    });
}

function startTimer() {
    clearInterval(timerId); // تصفير المؤقت القديم
    timeLeft = 30;
    document.getElementById("timer").innerText = "⏳ الوقت: " + timeLeft;
    timerId = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = "⏳ الوقت: " + timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerId);
            soundWrong.play();
            alert("⏰ انتهى الوقت!");
            finishGame(false);
        }
    }, 1000);
}

function finish() {
    const userAnswer = Array.from(document.getElementById("drop-area").children).map(b => b.innerText).join('').replace(/\s+/g, '');
    const correctAnswer = questions[currentQuestionIndex].correct.replace(/\s+/g, '');

    if (userAnswer === correctAnswer) {
        soundCorrect.play();
        score += 20;
        document.getElementById("score").innerText = score;
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            setTimeout(() => { loadQuestion(); startTimer(); }, 600);
        } else {
            setTimeout(() => finishGame(true), 600);
        }
    } else {
        soundWrong.play();
        alert("❌ الترتيب خاطئ!\nحاول مرة أخرى"); // رسالة الخطأ المطلوبة
    }
}

function finishGame(isWin) {
    clearInterval(timerId);
    showPage('result-page');
    document.getElementById("final-score").innerText = score;
    document.getElementById("correct-count").innerText = currentQuestionIndex;
}

function retry() { location.reload(); }

function goBack() {
    // تحديد الصفحة الحالية الظاهرة
    const languagePage = document.getElementById('language-page');
    const playPage = document.getElementById('play-page');

    if (languagePage.style.display === 'flex') {
        showPage('home-page'); // إذا كنت في اللغات ارجع للرئيسية
    } else if (playPage.style.display === 'flex') {
        clearInterval(timerId); // إيقاف المؤقت
        showPage('language-page'); // إذا كنت في اللعب ارجع للغات
    }
}