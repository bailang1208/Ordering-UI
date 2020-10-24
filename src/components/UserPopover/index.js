import React, { useRef, useEffect } from 'react'
import { useLanguage, useSession, LogoutAction as LogoutActionController, useEvent } from 'ordering-components'
import { usePopper } from 'react-popper'
import { HeaderItem, PopoverBody, PopoverArrow, PopoverList, PopoverListItem, PopoverListLink } from './styles'
import { DropDownCircleImage } from '../Dropdown/style'
import { FaUserAlt, FaRegAddressCard, FaRegListAlt, FaSignOutAlt } from 'react-icons/fa'

export const UserPopover = (props) => {
  const { open, isHome } = props
  const [sessionState] = useSession()
  const [, t] = useLanguage()
  const [events] = useEvent()
  const referenceElement = useRef()
  const popperElement = useRef()
  const arrowElement = useRef()
  const popper = usePopper(referenceElement.current, popperElement.current, {
    placement: 'auto',
    modifiers: [
      { name: 'arrow', options: { element: arrowElement.current } },
      {
        name: 'offset',
        options: {
          offset: [0, 12]
        }
      }
    ]
  })

  const { styles, attributes, forceUpdate } = popper

  useEffect(() => {
    forceUpdate && forceUpdate()
  }, [open, sessionState])

  const handleClickOutside = (e) => {
    if (!open) return
    const outsidePopover = !popperElement.current?.contains(e.target)
    const outsidePopoverMenu = !referenceElement.current?.contains(e.target)
    if (outsidePopover && outsidePopoverMenu) {
      props.onClose && props.onClose()
    }
  }

  const handleGoToPage = (page) => {
    events.emit('go_to_page', { page })
    props.onClick && props.onClick()
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleClickOutside)
    return () => window.removeEventListener('mouseup', handleClickOutside)
  }, [open])

  const popStyle = { ...styles.popper, visibility: open ? 'visible' : 'hidden', minWidth: '150px' }
  if (!open) {
    popStyle.transform = 'translate3d(0px, 0px, 0px)'
  }
  return (
    <div style={{ overflow: 'hidden' }}>
      <HeaderItem
        isPhoto={sessionState?.user?.photo}
        isHome={isHome}
        ref={referenceElement}
        onClick={props.onClick}
      >
        <DropDownCircleImage
          src={sessionState?.user?.photo}
          fallback={<FaUserAlt />}
        />
      </HeaderItem>
      <PopoverBody ref={popperElement} style={popStyle} {...attributes.popper}>
        <PopoverList>
          <PopoverListLink onClick={() => handleGoToPage('profile')}>
            <FaRegAddressCard /> {t('PROFILE', 'Profile')}
          </PopoverListLink>
          <PopoverListLink onClick={() => handleGoToPage('orders')}>
            <FaRegListAlt /> {t('ORDERS', 'Orders')}
          </PopoverListLink>
          <PopoverListItemLogout onClose={props.onClose} />
        </PopoverList>
        <PopoverArrow key='arrow' ref={arrowElement} style={styles.arrow} />
      </PopoverBody>
    </div>
  )
}

const LogoutActionUI = (props) => {
  const [, t] = useLanguage()

  const handleClick = () => {
    props.handleLogoutClick()
    props.onClose && props.onClose()
  }
  return (
    <PopoverListItem onClick={handleClick}>
      <FaSignOutAlt /> {t('LOGOUT', 'Logout')}
    </PopoverListItem>
  )
}

const PopoverListItemLogout = (props) => {
  const logoutActionProps = {
    UIComponent: LogoutActionUI,
    onClose: props.onClose
  }
  return (
    <LogoutActionController {...logoutActionProps} />
  )
}
