/* jshint esversion:6 */

/* Static values */
const ATTACK_VALUE = 12;
const MONSTER_ATTACK_VALUE = 15;
const STRONG_ATTACK_VALUE = 18;
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

/* if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
} */

let chosenMaxLife = 100;
let battleLog = [];
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let strongAttackClicks = 0;
let healClicks = 0;
healBtn.disabled = true;

swal("Hey Player 😃, you have to click 🖱️ on Attack button or Strong Attack button to enable the Heal button. Good luck 👍", {
  icon: "info",
  closeOnClickOutside: false
});

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
  if (
    event !== LOG_EVENT_PLAYER_ATTACK &&
    event !== LOG_EVENT_PLAYER_STRONG_ATTACK &&
    event !== LOG_EVENT_MONSTER_ATTACK &&
    event !== LOG_EVENT_PLAYER_HEAL &&
    event !== LOG_EVENT_GAME_OVER
  ) {
    // exit the function!!
    return;
  }

  let logEntry = {
    event: event,
    value: value,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };

  switch (event) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry.target = "PLAYER";
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry.target = "PLAYER";
      break;
    default:
      logEntry = {};
      break;
  }
  battleLog.push(logEntry);
}

function reset() {
  healClicks = 0;
  strongAttackClicks = 0;
  strongAttackBtn.disabled = false;
  healBtn.disabled = true;
  twoBonusLife();
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    "PLAYER DAMAGE IS: " + playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    swal("You Won!", {
      icon: "assets/icons/victory.png",
      closeOnClickOutside: false
    });
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON!",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    swal("You Lost!", {
      icon: "assets/icons/lost.png",
      closeOnClickOutside: false
    });
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER WON!",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    swal("You have a draw!", {
      icon: "assets/icons/OK.png",
      closeOnClickOutside: false
    });
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER & MONSTER HAVE LOST!",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }
  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

function attackMonster(mode) {
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
  const attackStrength = mode === MODE_ATTACK ? "NORMAL ATTACK" : "STRONG ATTACK";
  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(
    logEvent,
    "PLAYER ATTACKING WITH " + attackStrength + ". MONSTER DAMAGE IS:" + damage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function attackHandler() {
  healBtn.disabled = false;
  attackMonster(MODE_ATTACK);
}

function strongAttackHandler() {
  healBtn.disabled = false;
  attackMonster(MODE_STRONG_ATTACK);
  strongAttackClicks++;
  if (strongAttackClicks === 1) {
    swal("You have one strong attack left", {
      icon: "warning",
      closeOnClickOutside: false
    });
  } else if (strongAttackClicks >= 2) {
    strongAttackBtn.disabled = true;
  }
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    healValue = chosenMaxLife - currentPlayerHealth;
    swal("You can't heal to more than your max initial health.", {
      icon: "warning",
      closeOnClickOutside: false
    });
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  healClicks++;
  if (healClicks === 1) {
    bonusLifeEl.textContent = 1 + " bonus life";
    swal("You have one bonus life left", {
      icon: "warning",
      closeOnClickOutside: false
    });
  } else if (healClicks > 1) {
    bonusLifeEl.textContent = 0 + " bonus life";
    healBtn.disabled = true;
  }
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    "PLAYER HEALED WITH: " + healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLogHandler() {
  for (const battleLogIterator of battleLog) {
    console.log(battleLogIterator);
  }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);


