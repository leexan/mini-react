// 创建文本节点
function creatTextNode(text) {
    return {
        type: 'TEXT_ELEMENT',
        props: {
            nodeValue: text,
            children: []
        }
    }
}

/**
 * 创建元素
 * @param {*} type
 * @param {*} props
 * @param  {...any} children
 */
function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child => {
                const isTextNode = typeof child === 'string' || typeof child === 'number'
                if (isTextNode) {
                    return creatTextNode(child)
                }
                return child
            })
        }
    }
}

function render(el, container) {
    nextWorkOfUnit = {
        dom: container,
        props: {
            children: [el]
        }
    }
    root = nextWorkOfUnit;
}

let nextWorkOfUnit = null
let root = null
let currentRoot;

function commitWork(fiber) {
    if (!fiber) {
        return
    }
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent
    }
    if (fiber.effectTag === 'update') {
        updateProps(fiber.dom, fiber.props, fiber.alternate?.props)
    } else if (fiber.effectTag === 'placement') {
        if (fiber.dom) {
            fiberParent.dom.append(fiber.dom)
        }
        commitWork(fiber.child)
        commitWork(fiber.sibling)
    }
}

function commitRoot() {
    commitWork(root.child)
    currentRoot = root
    root = null
}

function workLoop(deadline) {
    let shouldYield = false
    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
        shouldYield = deadline.timeRemaining() < 1
    }
    if (!nextWorkOfUnit && root) {
        console.log('render结束')
        commitRoot()

    }
    requestIdleCallback(workLoop)

}

requestIdleCallback(workLoop)

function createDom(type) {
    console.log(type)
    return type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(type)

}

function initChildren(fiber, children) {
    let oldFiber = fiber.alternate?.child
    let preChild = null
    let newWork = null
    children.forEach((child, index) => {
        const sameType = child && oldFiber && child.type === oldFiber.type
        if (sameType) {
            // update
            newWork = {
                type: child.type,
                props: child.props,
                parent: fiber,
                child: null,
                sibling: null,
                dom: oldFiber.dom,
                effectTag: 'update',
                alternate: oldFiber
            }
        } else {
            newWork = {
                type: child.type,
                props: child.props,
                parent: fiber,
                child: null,
                sibling: null,
                dom: null,
                effectTag: 'placement',
            }
        }
        if (oldFiber) {
            oldFiber = oldFiber.sibling
        }
        if (index === 0) {
            fiber.child = newWork
        } else {
            preChild.sibling = newWork
        }
        preChild = newWork
    })
}

function updateFunctionComponent(fiber) {
    const children = [fiber.type(fiber.props)]
    initChildren(fiber, children)
}

function updateHostComponent(fiber) {
    if (!fiber.dom) {
        const dom = (fiber.dom = createDom(fiber.type))
        updateProps(dom, fiber.props, {})
    }
    const children = fiber.props.children
    initChildren(fiber, children)
}

function updateProps(dom, nextProps, prevProps,) {
    debugger
    // Object.keys(props)
    //     .filter(key => key !== 'children')
    //     .forEach(key => {
    //         if (key.startsWith('on')) {
    //             const eventType = key.toLowerCase().substring(2)
    //             dom.addEventListener(eventType, props[key])
    //         }
    //         dom[key] = props[key]
    //     })
//     删除旧的属性
    Object.keys(prevProps).forEach(key => {
        if (key !== 'children') {
            if (!(key in nextProps)) {
                dom.removeAttribute(key)
            }
        }
    })
    Object.keys(nextProps)
        .filter(key => key !== 'children')
        .forEach(key => {
            if (nextProps[key] !== prevProps[key]) {
                if (key.startsWith('on')) {
                    const eventType = key.toLowerCase().substring(2)
                    dom.addEventListener(eventType, nextProps[key])
                }
                dom[key] = nextProps[key]
            }
        })
}

function performWorkOfUnit(work) {
    const isFunctionComponent = typeof work.type === 'function'

    if (isFunctionComponent) {
        updateFunctionComponent(work)

    } else {
        updateHostComponent(work)
    }

//     返回下一个要执行的任务
    if (work.child) {
        return work.child
    }
    let nextWork = work
    while (nextWork) {
        if (nextWork.sibling) {
            return nextWork.sibling
        }
        nextWork = nextWork.parent
    }

}

function update() {
    nextWorkOfUnit = {
        dom: currentRoot.dom,
        props: currentRoot.props,
        alternate: currentRoot
    }
    root = nextWorkOfUnit;
}

const React = {
    createElement,
    render,
    update
}
export default React
