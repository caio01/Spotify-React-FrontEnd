import axios from 'axios'

export const URL = "http://18.229.123.27:3333"

export function post(entity, data) {
  axios({
    method: "POST",
    url: `${URL}/${entity}`,
    data : data
  })
}

export function update(entity, id, data) {
  axios({
    method: "PUT",
    url: `${URL}/${entity}/${id}`,
    data : data
  })
}

export function del(entity, id) {
  axios({
    method: "DELETE",
    url: `${URL}/${entity}/${id}`
  })
}

export function loginUser(email, password) {
  var response = axios({
    method: "POST",
    url: `${URL}/users/login`,
      data: {
        "email" : email,
        "password": password
      }
  })
  return response
}