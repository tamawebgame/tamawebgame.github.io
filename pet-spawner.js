const random = function (min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const randomFromArray = function (arr) {
  return arr[random(0, arr.length - 1)];
};

class SpriteElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.image = document.createElement("img");
    this.shadowRoot.appendChild(this.image);
    this.image.style["-webkit-user-drag"] = "none";
  }
  updateImage() {
    const src = this.getAttribute("src");
    const width = this.getAttribute("width");
    const height = this.getAttribute("height");
    const index = this.getAttribute("index");
    const naturalWidth =
      this.getAttribute("naturalWidth") || this.image.naturalWidth || 64;
    const posX = this.getAttribute("pos-x") || 0;
    const posY = this.getAttribute("pos-y") || 0;
    this.image.src = src;
    this.image.width = width;
    this.image.height = height;
    const x = (index % (naturalWidth / width)) * width;
    const y = Math.floor(index / (naturalWidth / width)) * height;
    this.image.style.objectFit = "none";
    this.image.style.objectPosition = `-${x + posX}px -${y + posY}px`;
    this.image.style.imageRendering = "pixelated";
  }
  connectedCallback() {
    this.updateImage();
  }
  attributeChangedCallback(name, oldValue, newValue) {
    this.updateImage();
  }
  static get observedAttributes() {
    return ["src", "width", "height", "index"];
  }
}
customElements.define("c-sprite", SpriteElement);

class InteractiveTamawebPet {
  deltaTime = 0;
  time = 0;
  waitMs = 0;

  speed = 100; // pixels per second
  position = { x: 0, y: 0 };
  targetPosition = null;
  lastTime = 0;

  pose = 0;
  walkAnimationTimer = 0;
  walkFrame = 0;
  isMoving = false;
  lastDirection = "left";

  // Add this to manually adjust click position
  clickOffsetY = 0; // Adjust this value (e.g., -10 or +10) if needed

  constructor(address, parentElement = document.body, config = {
    size: 128,
    cellSize: 32
  }) {
    this.address = address;
    this.config = config;

    this.sprite = document.createElement("c-sprite");
    this.sprite.setAttribute("src", this.address);
    this.sprite.setAttribute("naturalWidth", config.size);
    this.sprite.setAttribute("naturalHeight", config.size);
    this.sprite.setAttribute("width", config.cellSize);
    this.sprite.setAttribute("height", config.cellSize);
    this.sprite.setAttribute("index", 0);
    this.sprite.classList.add("interactive-pet");

    this.sprite.style.transformOrigin = "center center";
    this.sprite.style.position = "absolute";
    this.sprite.style.pointerEvents = "none"; // Prevents sprite from blocking clicks

    this.spriteImg = this.sprite.querySelector("img");

    parentElement.appendChild(this.sprite);

    // Set initial position
    this.setPosition(window.innerWidth / 2, window.innerHeight / 2);

    this.setup();
  }

  setup() {
    const onUpdate = (time) => {
      requestAnimationFrame(onUpdate);
      this.onUpdate(time);
    };

    onUpdate();
  }

  onUpdate(time) {
    if (this.lastTime === 0) {
      this.lastTime = time;
      return;
    }

    const deltaTime = Math.min(0.033, (time - this.lastTime) / 1000);
    this.lastTime = time;

    this.setPosition(this.position.x, this.position.y);

    if (this.targetPosition) {
      this.moveTowardsTarget(deltaTime);
    } else {
      this.stopWalking();
    }

    this.updateSprite();
    this.checkBounds();
  }

  checkBounds() {
    if (!this.position.x || !this.position.y) return;

    const widthBound = window.innerWidth - 32;
    const heightBound = document.documentElement.scrollHeight - 32;

    if (this.position.x > widthBound) {
      this.position.x = widthBound;
    }
    if (this.position.y > heightBound) {
      this.position.y = heightBound;
    }
  }

  moveTowardsTarget(deltaTime) {
    if (!this.targetPosition) return;

    const dx = this.targetPosition.x - this.position.x;
    const dy = this.targetPosition.y - this.position.y;
    const distance = Math.hypot(dx, dy);

    if (dx !== 0) {
      this.updateSpriteDirection(dx > 0);
    }

    this.startWalking();

    if (distance < 1) {
      this.position.x = this.targetPosition.x;
      this.position.y = this.targetPosition.y;
      this.updateSpritePosition();
      this.clearTarget();
      this.stopWalking();
      return;
    }

    const moveDistance = this.speed * deltaTime;

    if (moveDistance >= distance) {
      this.position.x = this.targetPosition.x;
      this.position.y = this.targetPosition.y;
      this.updateSpritePosition();
      this.clearTarget();
      this.stopWalking();
    } else {
      const ratio = moveDistance / distance;
      this.position.x += dx * ratio;
      this.position.y += dy * ratio;
      this.updateSpritePosition();
    }
  }

  updateSpriteDirection(movingRight) {
    if (movingRight) {
      this.sprite.style.transform = "scaleX(-1)";
      this.lastDirection = "right";
    } else {
      this.sprite.style.transform = "scaleX(1)";
      this.lastDirection = "left";
    }
  }

  startWalking() {
    if (!this.isMoving) {
      this.isMoving = true;
      this.walkFrame = 0;
      this.walkAnimationTimer = 0;
    }

    this.walkAnimationTimer += 1 / 120;

    if (this.walkAnimationTimer > 0.15) {
      this.walkAnimationTimer = 0;
      this.walkFrame = this.walkFrame === 0 ? 1 : 0;
    }

    const walkIndex = this.walkFrame === 0 ? 9 : 10;
    this.sprite.setAttribute("index", walkIndex);
  }

  stopWalking() {
    if (this.isMoving) {
      this.isMoving = false;
      this.sprite.setAttribute("index", 0);
    }
  }

  updateSpritePosition() {
    this.sprite.style.left = `${this.position.x - 16}px`;
    this.sprite.style.top = `${this.position.y - 16}px`;
  }

  setPosition(x, y) {
    this.position = { x, y };
    this.updateSpritePosition();
  }

  updateSprite() {
    // Optional: Add mirroring for direction if needed
  }

  setTargetPosition(x, y, payload) {
    const adjustedY = y + this.clickOffsetY;
    this.targetPosition = { x, y: adjustedY };
    this.onTargetPositionReachPayload = payload;
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  // Add this to manually adjust where the pet stops relative to click
  setClickOffsetY(offset) {
    this.clickOffsetY = offset;
  }

  getDistanceToTarget() {
    if (!this.targetPosition) return null;
    return Math.hypot(
      this.targetPosition.x - this.position.x,
      this.targetPosition.y - this.position.y
    );
  }

  clearTarget() {
    this.onTargetPositionReachPayload?.();
    this.onTargetPositionReachPayload = false;
    this.targetPosition = null;
  }

  // Debug method to show visual boundaries
  enableDebugMode() {
    this.sprite.style.outline = "1px solid red";
    this.sprite.style.outlineOffset = "0px";

    // Add a dot at the exact position
    const debugDot = document.createElement("div");
    debugDot.style.position = "fixed";
    debugDot.style.width = "4px";
    debugDot.style.height = "4px";
    debugDot.style.backgroundColor = "red";
    debugDot.style.borderRadius = "50%";
    debugDot.style.pointerEvents = "none";
    debugDot.style.zIndex = "9999";
    document.body.appendChild(debugDot);

    const updateDebugDot = () => {
      debugDot.style.left = `${this.position.x - 2}px`;
      debugDot.style.top = `${this.position.y - 2}px`;
      requestAnimationFrame(updateDebugDot);
    };
    updateDebugDot();
  }
}

(() => {
  const style = document.createElement("style");
  style.textContent = `
    .interactive-pet {
        position: absolute;
        top: 0;
        left: 0;
        scale: 2;
        z-index: 10;
        pointer-events: none;
    }
    .interactive-pet-container {
        position: absolute;
        left: 0;
        top: 0;
        width: stretch;
        height: stretch;
        overflow-x: hidden;
        pointer-events: none;
    }
    `;
  document.head.appendChild(style);

  const parentContainer = document.createElement('div');
  parentContainer.className = 'interactive-pet-container';
  document.body.appendChild(parentContainer)

  const mousePos = { x: 0, y: 0 };
  document.addEventListener("mousemove", (event) => {
    const mouseX = event.pageX;
    const mouseY = event.pageY;
    mousePos.x = mouseX;
    mousePos.y = mouseY;
  });

  const spawnFollowerPet = () => {
    const petAddress = `https://tamawebgame.github.io/game/resources/img/animal/dog_0${random(4, 5)}.png`;
    const pet = new InteractiveTamawebPet(
      petAddress,
      document.body,
      {
        size: 64,
        cellSize: 16,
      }
    );

    setInterval(() => {
      pet.setTargetPosition(mousePos.x, mousePos.y - 32);
    }, 500);
  };

  const spawnRandomPet = () => {
    const randomId = random(140, 370);
    const pet = new InteractiveTamawebPet(
      `https://tamawebgame.github.io/game/resources/img/character/chara_${randomId}b.png`,
      parentContainer
    );

    const getRandomPos = () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * document.documentElement.scrollHeight
    })

    const startingPosition = getRandomPos();
    pet.setPosition(
        startingPosition.x,
        startingPosition.y
    );

    const moveToRandom = () => {
        const elements = [...document.querySelectorAll('img, span, button, a')];
        const element = randomFromArray(elements);
        const rect = element.getBoundingClientRect();
        console.log(element)
        
        // const position = getRandomPos();
        const position = {
            x: rect.left, y: rect.top
        }
        pet.setTargetPosition(position.x, position.y, () => {
            element.style.transform = `rotate(${random(-5, 5)}deg)`
        });
    }

    setInterval(
      moveToRandom,
      random(5000, 20000)
    );
    setTimeout(moveToRandom, random(500, 2000))
  };

  spawnFollowerPet();
  // for (let i = 0; i < 2; i++) {
  //   spawnRandomPet();
  // }
})();

const makeFixed = (element) => {
    // const rect = element.getBoundingClientRect();
    // element.style.position = 'absolute';
    // element.style.top = rect.top;
    // element.style.left = rect.left;
}