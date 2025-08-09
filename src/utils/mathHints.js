// Generate a random number within a range
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generate a random equation that equals the target number
export const generateEquation = (target) => {
  const operations = [
    {
      op: '+',
      generate: (result) => {
        const num1 = getRandomInt(0, result);
        return { num1, num2: result - num1, symbol: '+' };
      }
    },
    {
      op: '-',
      generate: (result) => {
        const num1 = getRandomInt(result, result + 10);
        return { num1, num2: num1 - result, symbol: '-' };
      }
    },
    {
      op: '*',
      generate: (result) => {
        const factors = [];
        for (let i = 1; i <= result; i++) {
          if (result % i === 0) factors.push(i);
        }
        if (factors.length < 2) return null;
        const randomIndex = getRandomInt(0, factors.length - 1);
        const num1 = factors[randomIndex];
        return { num1, num2: result / num1, symbol: '×' };
      }
    }
  ];

  // Filter out multiplication if target is prime or 1
  const validOps = operations.filter(op => {
    if (op.op === '*' && (target === 1 || !hasFactors(target))) return false;
    return true;
  });

  const operation = validOps[getRandomInt(0, validOps.length - 1)];
  const equation = operation.generate(target);
  
  return `${equation.num1} ${equation.symbol} ${equation.num2} = ?`;
};

// Helper function to check if a number has factors other than 1 and itself
const hasFactors = (num) => {
  for (let i = 2; i < num; i++) {
    if (num % i === 0) return true;
  }
  return false;
};
