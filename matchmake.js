const DEBUG = false;

/**
 * Determine the  maximum number of rounds for a given player set such that no player
 * plays with someone they have played with before and then return that list of rounds
 * @param {*} players 
 */
function generateRounds(players) {
  const rounds = [];
  const numTeams = players.length / 2;
  
  // beyond length / 2 for the spread, your spread is identical to previous spreads
  // i.e. for 12 players, spread of 7 is the same as spread 5 in reverse
  for (let spread = 1; spread <= numTeams; spread++) {
    
    // this algorithm is neat in that we can generate two rounds simultaneously for a
    // given spread
    const round0 = [];
    const round1 = [];
    const set0 = new Set();
    const set1 = new Set();

    let current = 0;
    let round = 0;

    if (DEBUG) {
      console.log(`\nChecking spread of ${spread}\n`);
    }

    // run through the algorithm building up pairings for the rounds until we run out 
    // of people for each round or a set has seen current before, indicating that one 
    // player would need to be paired twice
    while (set1.size < numTeams) {

      // if we've encountered the current number before, that's okay, we just looped, 
      // increment current and keep going
      if (round === 0 && set0.has(current) || round === 1 && set1.has(current)) {
        current++;
      }
      
      // find the next index
      const next = (current + spread) % players.length;
      const team = generateTeam(current, next);
      if (DEBUG) {
        console.log(`adding [${current},${next}] to round ${round}`);
      }

      // oscillate between adding to round 0 and 1
      if (round === 0) {
        
        // if next is already in the set, it has been used before
        // note: no need to check for round 1 because round 0 will happen first and break
        // 
        // TODO: potential opimization: we can generate the spreads that will work 
        // beforehand by finding the least common multiple of spread and players.length, 
        // dividing that by spread, and returning true if even
        if (set0.has(next)) break;

        // add to round 0
        round0.push(team);
        set0.add(current);
        round = 1;
      } else {
        // add to round 1
        round1.push(team);
        set1.add(current);
        round = 0;
      }

      // update current
      current = next;

      if (DEBUG) {
        console.log(`round0: ${round0} round1: ${round1}\n`);
      }
    }

    // double check everyone was used, then add to rounds
    if (set0.size === numTeams) {
      rounds.push(round0);

      // when the spread # the number of teams possible, 
      // both rounds will have identical teams
      if (spread < numTeams) {
        rounds.push(round1);
      }
    }
  }

  return rounds;
}

/**
 * Given two players a and b, return a string representing that team
 * @param {*} a 
 * @param {*} b 
 */
function generateTeam(a, b) {
  return [a, b].sort((x, y) => x - y).join('_');
}

/**
 * Return an array of numbers given a count
 * @param {*} count 
 */
function generatePlayers(count) {
  return [...Array(count).keys()]
}


// init
for (let i = 4; i < 41; i += 2) {
  const players = generatePlayers(i);

  console.log(`\nGenerating pairs for ${i}`)
  const rounds = generateRounds(players);
  for (let i = 0; i < rounds.length; i++) {
    console.log(`${i + 1}: ${rounds[i].toString()}`);
  }
}