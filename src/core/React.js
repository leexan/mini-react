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

function commitWork(fiber) {
    if (!fiber) {
        return
    }
    let fiberParent = fiber.parent
    while (!fiberParent.dom) {
        fiberParent = fiberParent.parent
    }
    if (fiber.dom) {
        fiberParent.dom.append(fiber.dom)
    }
    commitWork(fiber.child)
    commitWork(fiber.sibling)
}

function commitRoot() {
    commitWork(root.child)
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
    let preChild = null
    children.forEach((child, index) => {
        const newWork = {
            type: child.type,
            props: child.props,
            parent: fiber,
            child: null,
            sibling: null,
            dom: null
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
        const dom=(fiber.dom = createDom(fiber.type))
        updateProps(dom, fiber.props)
    }
    const children = fiber.props.children
    initChildren(fiber,children )
}
function updateProps(dom, props) {
    Object.keys(props)
        .filter(key => key !== 'children')
        .forEach(key => {
            if(key.startsWith('on')){
                const eventType=key.toLowerCase().substring(2)
                dom.addEventListener(eventType,props[key])
            }
            dom[key] = props[key]
        })
}

function performWorkOfUnit(work) {
    const isFunctionComponent = typeof work.type === 'function'

    if(isFunctionComponent){
        updateFunctionComponent(work)

    }else{
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

const React = {
    createElement,
    render
}
export default React
