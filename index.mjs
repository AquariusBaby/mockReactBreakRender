import rootVdom from './nodeMock.mjs';

function renderSync(rootVdom) {
    // const $container = document.createElement('div');
    const $container = document.getElementById('root');
    const INTERVAL = 5; // 每次只执行5ms
    // const DOMKEY = Symbol('DOMKEY'); // 将真实dom暂存在vdom上面

    let queue = [[rootVdom]];
    let domQueue = [$container];

    function render() {
        const start = performance.now();

        // 只执行5ms
        while (performance.now() - start < INTERVAL) {
            // console.log(queue, 'queue')
            if (queue.length === 0) {
                return $container;
            }

            // 为了让运行时间长一点
            let time = 50000;
            while (time) {
                time--;
            }

            let vdomList = queue.pop();
            let $dom;

            if (Array.isArray(vdomList)) {
                // 父Dom节点
                let parentDom = domQueue.pop();

                for (let vdom of vdomList) {
                    if (typeof vdom === 'string') {
                        // 文本节点
                        $dom = document.createTextNode(vdom);

                        parentDom.appendChild($dom);
                    } else {
                        // vdom节点
                        const { type, props = {}, children = [] } = vdom;
                        $dom = document.createElement(type);
                        Object.keys(props).forEach(key => $dom.setAttribute(key, props[key]));

                        queue.push(children);
                        parentDom.appendChild($dom);
                        domQueue.push($dom);
                    }
                }
            }
        }

        // 让出主线程
        setTimeout(() => {
            console.log('让出主线程');
            // let node = document.createTextNode('让出主线程')
            // $container.appendChild(node)
            render()
        }, 0)
    }

    return render();
}

renderSync(rootVdom);
