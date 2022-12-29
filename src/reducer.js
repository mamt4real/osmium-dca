export const initialState = {
  transactions: [],
  aggregates: [],
  loadingData: false,
  coins: [],
  user: null,
  userType: null,
  token: null,
}

const updateFunction = (collection, modified, isDelete = false) => {
  const index = collection.findIndex((ses) => ses.id === modified?.id)
  const updated = [...collection]
  if (isDelete) updated.splice(index, 1)
  else updated[index] = modified
  return updated
}

export const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loadingData: action.data,
      }
    case 'SET_COINS':
      return {
        ...state,
        coins: action.data,
      }
    case 'SET_AGGREGATES':
      return {
        ...state,
        aggregates: [...action.data],
      }
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.data,
      }

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: updateFunction(state.transactions, action.data),
      }
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: updateFunction(
          state.transactions,
          { id: action.data },
          true
        ),
      }
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.data],
      }
    case 'CLEAR_ASSET_RECORDS':
      return {
        ...state,
        transactions: state.transactions.filter(
          (tr) => tr.asset !== action.data
        ),
      }
    case 'SET_USER':
      return {
        ...state,
        user: action.data,
      }
    case 'SET_USER_TYPE':
      return {
        ...state,
        userType: action.data,
      }
    case 'UPDATE_USER': {
      return {
        ...state,
        user: { ...state.user, [action.key]: action.value },
      }
    }
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.token,
      }
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        user: null,
      }
    default:
      console.error(`Action ${action.type} not Implemented`)
      return state
  }
}
