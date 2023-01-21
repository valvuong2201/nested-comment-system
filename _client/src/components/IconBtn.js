import React from 'react'

const IconBtn = ({ Icon, isActive, color, children, ...props }) => {
  return (
    <button className={`btn icon-btn ${isActive ? 'icon-btn-acive' : ''} ${color || ''}`} {...props}>
        <span className={`${children != null ? 'mr-1' : ''}`}>
            <Icon />
        </span>
        {children}
    </button>
  )
}

export default IconBtn