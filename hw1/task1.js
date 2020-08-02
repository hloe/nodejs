import readline from 'readline';

(function task1() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  (function askString() {
    rl.question('Please enter a string: ', function(input) {
      const reversed = input
        .split('')
        .reverse()
        .join('');

      console.log(`You wrote: ${input}`);
      console.log(`Reversed string is: ${reversed}`);

      askString();
    });
  })();

  rl.on('close', function() {
    process.exit(0);
  });
})();