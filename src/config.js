export const API = process.env.REACT_APP_API_URL;

export const fetchPolicies = (filterValue, filterBy) => {
  let paramsObj = { filterBy };

  const URI = API + filterValue + '?' + new URLSearchParams(paramsObj);
  return fetch(URI)
  .then(res => res.json())
  .then(policies => (policies))
}
