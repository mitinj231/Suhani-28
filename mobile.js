let highestZ = 1;

class Paper {
  holdingPaper = false;
  touchStartX = 0;
  touchStartY = 0;
  touchMoveX = 0;
  touchMoveY = 0;
  touchEndX = 0;
  touchEndY = 0;
  prevTouchX = 0;
  prevTouchY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    paper.addEventListener('touchmove', (e) => {
      if (!this.holdingPaper || this.rotating) return; // Prevent accidental dragging while rotating
      
      e.preventDefault(); // Prevent scrolling when dragging
      
      this.touchMoveX = e.touches[0].clientX;
      this.touchMoveY = e.touches[0].clientY;

      // Calculate velocity
      this.velX = this.touchMoveX - this.prevTouchX;
      this.velY = this.touchMoveY - this.prevTouchY;

      // Update position
      this.currentPaperX += this.velX;
      this.currentPaperY += this.velY;

      this.prevTouchX = this.touchMoveX;
      this.prevTouchY = this.touchMoveY;

      // Apply transformation
      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    });

    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;

      this.holdingPaper = true;

      // Bring the paper to the front
      paper.style.zIndex = highestZ;
      highestZ += 1;

      // Initialize starting positions
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.prevTouchX = this.touchStartX;
      this.prevTouchY = this.touchStartY;
    });

    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // For two-finger rotation on touch screens
    paper.addEventListener('gesturestart', (e) => {
      e.preventDefault();
      this.rotating = true;
    });

    paper.addEventListener('gesturechange', (e) => {
      if (!this.rotating) return;

      // Update rotation based on gesture
      this.rotation += e.rotation;
      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    });

    paper.addEventListener('gestureend', () => {
      this.rotating = false;
    });
  }
}

// Initialize papers
const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
