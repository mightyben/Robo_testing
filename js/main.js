let targetUrl = '';
const adDuration = 5; // Ad lock time in seconds

// Play simple click dynamic feedback sound
function playClickSound() {
    const sound = document.getElementById('clickSound');
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log("Audio playback initiated post user-gesture context."));
    }
}

// Global Ad deployment trigger sequence
function triggerAd(destinationUrl) {
    playClickSound();
    targetUrl = destinationUrl;
    
    // Initialize & Show BootStrap Modal
    const adModalEl = document.getElementById('adModal');
    const adModal = new bootstrap.Modal(adModalEl);
    adModal.show();
    
    // Start Ad Countdown Timer tracking sequence
    let timeLeft = adDuration;
    const countdownText = document.getElementById('adTimer');
    const progressBar = document.getElementById('adProgressBar');
    const actionBtn = document.getElementById('closeAdBtn');
    
    actionBtn.classList.add('disabled');
    actionBtn.innerText = "Please Wait...";
    progressBar.style.width = '0%';
    countdownText.innerText = timeLeft;

    const interval = setInterval(() => {
        timeLeft--;
        countdownText.innerText = timeLeft;
        
        let percentage = ((adDuration - timeLeft) / adDuration) * 100;
        progressBar.style.width = `${percentage}%`;

        if (timeLeft <= 0) {
            clearInterval(interval);
            actionBtn.classList.remove('disabled');
            actionBtn.innerText = "Continue to App";
        }
    }, 1000);
}

// Redirect post ad sequence validation completion
function proceedToApp() {
    playClickSound();
    if(targetUrl) {
        window.location.href = targetUrl;
    }
}

// Dashboard Dynamic Input Filter Search System
document.getElementById('toolSearch').addEventListener('input', function(e) {
    const value = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.tool-card-wrapper');
    
    cards.forEach(card => {
        const searchTerms = card.getAttribute('data-name');
        if(searchTerms.includes(value)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});
