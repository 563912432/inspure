// import Cookies from 'js-cookie'

const NameKey = 'Admin-Name'
const AvatarKey = 'Admin-Avatar'

export function getName() {
  return sessionStorage.getItem(NameKey)
}

export function setName(name) {
  return sessionStorage.setItem(NameKey, name)
}

export function removeName() {
  return sessionStorage.removeItem(NameKey)
}

export function getAvatar() {
  return sessionStorage.getItem(AvatarKey)
}

export function setAvatar(avatar) {
  return sessionStorage.setItem(AvatarKey, avatar)
}

export function removeAvatar() {
  return sessionStorage.removeItem(AvatarKey)
}
