export const API = 'http://localhost:8080/api/policy/';

export const fetchPolicies = (filterValue, filterBy) => {
  let paramsObj = { filterBy };

  const URI = API + filterValue + '?' + new URLSearchParams(paramsObj);
  return fetch(URI)
  .then(res => res.json())
  .then(policies => (policies))
}
