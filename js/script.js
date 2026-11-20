const frames = [
  {
    id: 2,
    text: "일본에서는 1990년대 버블 붕괴 이후 취업 빙하기를 겪었다."
  },
  {
    id: 3,
    text: "안정적인 일자리를 얻지 못한 채 사회 진출에 실패한 청년A는<br>장기 은둔형 외톨이 혹은 비정규직 상태로 남아,<br>고령화를 겪게 되면서 문제는 심화되었다."
  }
];

let currentIndex = 0;
let isAnimating = false;

const stage = document.querySelector('.stage');
const storyText = document.getElementById('story-text');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');
const btnHand = document.getElementById('btn-hand');
const btnFlashlight = document.getElementById('btn-flashlight');
const allButtons = document.querySelectorAll('.ui-btn');

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'hover') {
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(620, now);
    oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.05);
    gainNode.gain.setValueAtTime(0.06, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    oscillator.start(now);
    oscillator.stop(now + 0.05);
  } else if (type === 'click') {
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(320, now);
    oscillator.frequency.exponentialRampToValueAtTime(140, now + 0.14);
    gainNode.gain.setValueAtTime(0.18, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    oscillator.start(now);
    oscillator.stop(now + 0.14);
  }
}

allButtons.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    if (!btn.disabled) playSound('hover');
  });
  btn.addEventListener('click', () => {
    if (!btn.disabled) playSound('click');
  });
});

function updateFrame(newIndex) {
  if (isAnimating || newIndex < 0 || newIndex >= frames.length || newIndex === currentIndex) {
    return;
  }

  isAnimating = true;
  currentIndex = newIndex;

  if (currentIndex === 1) {
    stage.classList.add('is-frame-3');
  } else {
    stage.classList.remove('is-frame-3');
  }

  storyText.classList.add('fade-out');

  setTimeout(() => {
    storyText.innerHTML = frames[currentIndex].text;
    storyText.classList.remove('fade-out');
    isAnimating = false;
  }, 420);

  btnPrev.disabled = currentIndex === 0;
  btnNext.disabled = currentIndex === frames.length - 1;
}

btnPrev.addEventListener('click', () => updateFrame(currentIndex - 1));
btnNext.addEventListener('click', () => updateFrame(currentIndex + 1));

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    if (!btnNext.disabled) {
      playSound('click');
      updateFrame(currentIndex + 1);
    }
  } else if (e.key === 'ArrowLeft') {
    if (!btnPrev.disabled) {
      playSound('click');
      updateFrame(currentIndex - 1);
    }
  }
});

btnHand.addEventListener('click', () => {
  const isAlreadyActive = btnHand.classList.contains('active');
  document.body.classList.remove('cursor-hand', 'cursor-flashlight');
  btnHand.classList.remove('active');
  btnFlashlight.classList.remove('active');

  if (!isAlreadyActive) {
    document.body.classList.add('cursor-hand');
    btnHand.classList.add('active');
  }
});

btnFlashlight.addEventListener('click', () => {
  const isAlreadyActive = btnFlashlight.classList.contains('active');
  document.body.classList.remove('cursor-hand', 'cursor-flashlight');
  btnHand.classList.remove('active');
  btnFlashlight.classList.remove('active');

  if (!isAlreadyActive) {
    document.body.classList.add('cursor-flashlight');
    btnFlashlight.classList.add('active');
  }
});