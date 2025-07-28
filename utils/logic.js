
function bonusXP(screenTime) {
    if (screenTime <= 30) return 150;
    if (screenTime <= 60) return 100;
    if (screenTime <= 120) return 70;
    if (screenTime <= 180) return 40;
    if (screenTime <= 240) return 20;
    if (screenTime <= 300) return 10;
    return 0;
}

function calculateXP(screenTimeToday, target) {
    if (screenTimeToday <= target) {
        return 25;
    } else {
        return 0;
    }
}

function getXPToNextLevel(xp) {
    const levelThresholds = [
        0,     // Level 1
        166,   // Level 2
        400,   // Level 3
        666,   // Level 4
        1000,  // Level 5
        1400,  // Level 6
        1866,  // Level 7
        2400,  // Level 8
        3000,  // Level 9
        3666,  // Level 10
        4400,  // Level 11
        5200,  // Level 12
        6066,  // Level 13
        7000,  // Level 14
        8000,  // Level 15
        9066,  // Level 16
        10200, // Level 17
        11400, // Level 18
        12666, // Level 19
        14000  // Level 20
    ];

    for (let i = levelThresholds.length - 1; i >= 0; i--) {
        if (xp >= levelThresholds[i]) {
            // If it's the last level, return 0 (no next level)
            if (i === levelThresholds.length - 1) return 0;
            return levelThresholds[i + 1] - xp;
        }
    }

    return levelThresholds[1] - xp; // XP needed for Level 2
}


function getLevel(xp) {

    const levelThresholds = [
        0,     // Level 1
        166,   // Level 2
        400,   // Level 3
        666,   // Level 4
        1000,  // Level 5
        1400,  // Level 6
        1866,  // Level 7
        2400,  // Level 8
        3000,  // Level 9
        3666,  // Level 10
        4400,  // Level 11
        5200,  // Level 12
        6066,  // Level 13
        7000,  // Level 14
        8000,  // Level 15
        9066,  // Level 16
        10200, // Level 17
        11400, // Level 18
        12666, // Level 19
        14000  // Level 20
    ];

    for (let i = levelThresholds.length - 1; i >= 0; i--) {
        if (xp >= levelThresholds[i]) {
            return i + 1;
        }
    }
    return 1;
}

function streakXP(streak) {
  return Math.min(streak * 3, 100);  
}

function getPetType(level) {
  if (level <= 3) return 'Chihuahua';
  if (level <= 6) return 'Pomeranian';
  if (level <= 9) return 'Pug';
  if (level <= 12) return 'Beagle';
  if (level <= 15) return 'Cocker Spaniel';
  if (level <= 18) return 'Golden Retriever';
  return 'Great Dane';
}

module.exports = { bonusXP, calculateXP , getLevel , getPetType, getXPToNextLevel , streakXP};