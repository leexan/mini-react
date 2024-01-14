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
                if (typeof child === 'string') {
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
}

let nextWorkOfUnit = null

function workLoop(deadline) {
    let shouldYield = false
    while (!shouldYield && nextWorkOfUnit) {
        nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit)
        shouldYield = deadline.timeRemaining() < 1
    }
    requestIdleCallback(workLoop)

}

requestIdleCallback(workLoop)

function performWorkOfUnit(work) {
    if (!work.dom) {
        // 创建dom
        const dom = (
            work.dom = work.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(work.type)
        )
        work.parent.dom.appendChild(dom)
//     2.处理props
        Object.keys(work.props).forEach(key => {
            if (key !== 'children') {
                dom[key] = work.props[key]
            }
        })
    }

//     3.转换链表,处理好指针
    let preChild = null
    const children = work.props.children
    children.forEach((child, index) => {
        const newWork = {
            type: child.type,
            props: child.props,
            parent: work,
            child: null,
            sibling: null,
            dom: null
        }
        if (index === 0) {
            work.child = newWork
        } else {
            preChild.sibling = newWork
        }
        preChild = newWork
    })

//     返回下一个要执行的任务
    if (work.child) {
        return work.child
    }
    if (work.sibling) {
        return work.sibling
    }
    return work.parent?.sibling
}

const React = {
    createElement,
    render
}
export default React
