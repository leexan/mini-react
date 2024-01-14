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
    const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)
    Object.keys(el.props).forEach(key => {
        if (key !== 'children') {
            dom[key] = el.props[key]
        }
    })
    const children = el.props.children
    children.forEach(child => {
        render(child, dom)
    })
    container.append(dom)
}

const React = {
    createElement,
    render
}
export default React
