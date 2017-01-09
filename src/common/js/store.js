/**
 * Save localStorage
 */
export function saveToLocal(id, key, value) {
  let store = window.localStorage.__store__ // private variable

  if(!store) {
    store = {}
    store[id] = {}
  } else {
    store = JSON.parse(store) // Parse the store to a obj

    if(!store[id]) {
      store[id] = {}
    }
  }

  /**
   * @return {id: {key: value}}
   */
  store[id][key] = value
  window.localStorage.__store__ = JSON.stringify(store) // Transform the obj to a string
}

/**
 * Load localStorage
 * Have a default value if "id" don't exist
 */
export function loadFromLocal(id, key, def) {
  let store = window.localStorage.__store__ // private variable

  if(!store) { // if store don't exist
    return def
  }

  store = JSON.parse(store)[id]

  if(!store) { // if store.id don't exist
    return def
  }

  let ret = store[key] // store.id exist
  return ret || def
}
