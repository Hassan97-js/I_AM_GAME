/* jshint esversion:6 */

/* Capitalized Words For Static Values */
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
const CHOSEN_MAX_LIFE = 100;

let battleLog = [];
let currentMonsterHealth = CHOSEN_MAX_LIFE;
let currentPlayerHealth = CHOSEN_MAX_LIFE;
let strongAttackClicks = 0;
let healClicks = 0;
healBtn.disabled = true;

swal(
  "Hey Player 😃, you have to click 🖱️ on Attack button or Strong Attack button to enable the Heal button. Good luck 👍",
  {
    icon: "info",
    closeOnClickOutside: false
  }
);

/* Write to log function for building the logEntry object */
function writeToLog (event, value, monsterHealth, playerHealth) {
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
    finalPlayerHealth: playerHealth
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

/* Reset function for resting the game */
function reset () {
  healClicks = 0;
  strongAttackClicks = 0;
  strongAttackBtn.disabled = false;
  healBtn.disabled = true;
  twoBonusLife();
  currentMonsterHealth = CHOSEN_MAX_LIFE;
  currentPlayerHealth = CHOSEN_MAX_LIFE;
  resetGame(CHOSEN_MAX_LIFE);
}

/* endRound function for attacking the player by monster & checking who's won */
function endRound () {
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

/* attackMonster for deciding the damage of attack mode*/
function attackMonster (mode) {
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent =
    mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;
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

/* attackHandler for attacking monster when the attack button is pressed */
function attackHandler () {
  healBtn.disabled = false;
  attackMonster(MODE_ATTACK);
}

/* strongAttackHandler for strong attacking monster when the strong attack button is pressed */
function strongAttackHandler () {
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

/* healPlayerHandler for healing the player depending on the healValue */
function healPlayerHandler () {
  let healValue;
  if (currentPlayerHealth >= CHOSEN_MAX_LIFE - HEAL_VALUE) {
    healValue = CHOSEN_MAX_LIFE - currentPlayerHealth;
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

/* printLogHandler function for looping over logEntry object & console log the battle description */
function printLogHandler () {
  for (const battleLogIterator of battleLog) {
    console.log(battleLogIterator);
  }
}

/* addEventListener built-in functions to add the different events to different buttons */
attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
