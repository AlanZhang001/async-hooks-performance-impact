const cp = require('child_process');

const BENCHMARKS = [ 'bluebird-doxbee.js', 'bluebird-parallel.js', 'wikipedia.js', 'koaserver.js'];
const hook = './async-hook.js';

async function main() {
  console.log(`node version:${process.versions.node},v8 version:${process.versions.v8}`);
  for (benchmark of BENCHMARKS) {
    const regular = cp.spawnSync(process.execPath, [ benchmark ]);
    console.log(`regular                     ${regular.stdout.toString().trim()}`);
    const init = cp.spawnSync(process.execPath,
      [ '--require', './async-hook-init.js', benchmark ]);
    console.log(`init                        ${init.stdout.toString().trim()}`);
    const full = cp.spawnSync(process.execPath,
      [ '--require', './async-hook-full.js', benchmark ]);
    console.log(`init,destroy,promiseResolve ${full.stdout.toString().trim()}`);
  }
}

main().catch(console.error);
