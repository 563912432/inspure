// import Cookies from 'js-cookie'

const TokenKey = 'Admin-Menu'
const NameKey = 'Admin-Name'
const AvatarKey = 'Admin-Avatar'
const RoleKey = 'Admin-Role'
const TelKey = 'Admin-Tel'

// 设置菜单
export function getMenu() {
  return sessionStorage.getItem(TokenKey)
}

export function setMenu(token) {
  return sessionStorage.setItem(TokenKey, token)
}

export function removeMenu() {
  return sessionStorage.removeItem(TokenKey)
}

// 设置用户名
export function getName() {
  return sessionStorage.getItem(NameKey)
}

export function setName(token) {
  return sessionStorage.setItem(NameKey, token)
}

export function removeName() {
  return sessionStorage.removeItem(NameKey)
}

// 设置头像
export function getAvatar() {
  return sessionStorage.getItem(AvatarKey)
}

export function setAvatar(token) {
  return sessionStorage.setItem(AvatarKey, token)
}

export function removeAvatar() {
  return sessionStorage.removeItem(AvatarKey)
}

// 设置角色
export function getRole() {
  return sessionStorage.getItem(RoleKey)
}

export function setRole(token) {
  return sessionStorage.setItem(RoleKey, token)
}

export function removeRole() {
  return sessionStorage.removeItem(RoleKey)
}
// 设置电话
export function getTel() {
  return sessionStorage.getItem(TelKey)
}

export function setTel(tel) {
  return sessionStorage.setItem(TelKey, tel)
}

export function removeTel() {
  return sessionStorage.removeItem(TelKey)
}
