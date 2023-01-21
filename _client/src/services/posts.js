import { makeRequest } from "./makeRequest";

export function getPosts() {
    return makeRequest('/api/posts')
}

export function getPost(id) {
    return makeRequest(`/posts/${id}`)
}