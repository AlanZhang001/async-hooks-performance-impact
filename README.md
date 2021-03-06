# Performance impact of async_hooks

 - https://github.com/nodejs/diagnostics/issues/124
 - https://github.com/nodejs/benchmarking/issues/188

This is a simple demo of the potential performance impact of `async_hooks`
on Promise heavy workloads. This repository contains the popular
[Bluebird](https://github.com/petkaantonov/bluebird) benchmarks and the
so-called *Wikipedia Promise* benchmark with and
without `async_hooks` (running with native promises).

To measure the actual impact there's a version of each benchmark with
an empty `init` hook, i.e. we prepend the following code to the actual
code under test:

```js
const async_hooks = require('async_hooks');
const hook = async_hooks.createHook({
    init(asyncId, type, triggerAsyncId) { }
});
hook.enable();
```

We also test with all hooks (i.e. `init`, `destroy`
and `promiseResolve`) using the following snippet:

```js
const async_hooks = require('async_hooks');
const hook = async_hooks.createHook({
    init(asyncId, type, triggerAsyncId, resource) { },
    destroy(asyncId) { },
    promiseResolve(asyncId) { },
});
hook.enable();
```

## Results

Here the results of running the Promise micro benchmarks with and without
`async_hooks` enabled:

| Benchmark                      | Node 8.9.4 | Node 9.4.0 |
| ------------------------------:| ----------:| ----------:|
| Bluebird-doxbee (regular)      |     226 ms |     189 ms |
| Bluebird-doxbee (init hook)    |     383 ms |     341 ms |
| Bluebird-doxbee (all hooks)    |     440 ms |     411 ms |
| Bluebird-parallel (regular)    |     924 ms |     696 ms |
| Bluebird-parallel (init hook)  |    1380 ms |    1050 ms |
| Bluebird-parallel (all hooks)  |    1488 ms |    1220 ms |
| Wikipedia (regular)            |     993 ms |     804 ms |
| Wikipedia (init hook)          |    2025 ms |    1893 ms |
| Wikipedia (all hooks)          |    2109 ms |    2124 ms |

![Results for Node 9.4.0](https://raw.githubusercontent.com/bmeurer/async-hooks-performance-impact/master/results-promise-node-9.4.0.png)

And we also ran some more realistic benchmarks, based on `hapi` and
`koa`, with and without `async_hooks` enabled:

| Benchmark         | Node 9.4.0    |
| ----------------: | ------------: |
| hapi (asynchooks) | 6026.9 reqs   |
| hapi (regular)    | 9024.19 reqs  |
| koa (asynchooks)  | 11508.6 reqs  |
| koa (regular)     | 12592.55 reqs |

The `koa` benchmark is pretty flaky, so the performance difference could be
within noise and thus not relevant.

![Results for Node 9.4.0](https://raw.githubusercontent.com/bmeurer/async-hooks-performance-impact/master/results-hapi-koa-node-9.4.0.png)

#### node 10 result
```js
node version:10.19.0,v8 version:6.8.275.32-node.55
-----------------------------------------------------
regular                     Bluebird-doxbee: 127 ms.
init                        Bluebird-doxbee: 457 ms.
init,destroy,promiseResolve Bluebird-doxbee: 474 ms.
-----------------------------------------------------
regular                     Bluebird-parallel: 176 ms.
init                        Bluebird-parallel: 881 ms.
init,destroy,promiseResolve Bluebird-parallel: 930 ms.
-----------------------------------------------------
regular                     Wikipedia: 314 ms.
init                        Wikipedia: 1658 ms.
init,destroy,promiseResolve Wikipedia: 1766 ms.
-----------------------------------------------------
regular                     koaserver: 15748.8 reqs.
init                        koaserver: 14047.2 reqs.
init,destroy,promiseResolve koaserver: 12687.2 reqs.
-----------------------------------------------------
```

## Bluebird benchmarks

The files here are modified from: [https://github.com/petkaantonov/bluebird/tree/master/benchmark](https://github.com/petkaantonov/bluebird/tree/master/benchmark)

The current version is based on `bluebird@c0d4472cecd523c2f9d4805a23d87be3cfe03b41`


## Wikipedia Benchmark

The files here are modified from: [https://github.com/wikimedia/web-stream-util](https://github.com/wikimedia/web-stream-util)

The current version is based on `web-stream-util@fc76740cd6a73dcb044251a233bc3c868d3c9a77`
