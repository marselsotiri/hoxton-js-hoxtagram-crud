

const imageContainerEl = document.querySelector('.image-container')

const state = {
  images: []
}

function getImages() {
  return fetch('http://localhost:3000/images').then(resp => resp.json()) // Promise<images>
}

function createLikeBtn(number, imageId){
return fetch('http://localhost:3000/images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      imageId: imageId,
      likes: number
    })
  }).then(resp => resp.json())
}

function deleteTodoFromServer (id) {
  return fetch(`http://localhost:3000/comments/${id}`, {
    method: 'DELETE'
  })
}


function createCommentOnServer(imageId, content) {
  return fetch('http://localhost:3000/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      imageId: imageId,
      content: content
    })
  }).then(resp => resp.json())
}

// RENDER FUNCTIONS
function renderImage(image) {
  const articleEl = document.createElement('article')
  articleEl.setAttribute('class', 'image-card')

  const titleEl = document.createElement('h2')
  titleEl.setAttribute('class', 'title')
  titleEl.textContent = image.title

  const imgEl = document.createElement('img')
  imgEl.setAttribute('class', 'image')
  imgEl.setAttribute('src', image.image)

  const buttonsDiv = document.createElement('div')
  buttonsDiv.setAttribute('class', 'likes-section')

  const likesEl = document.createElement('span')
  likesEl.setAttribute('class', 'likes')
  likesEl.textContent = `${image.likes} likes`

  const likeBtn = document.createElement('button')
  likeBtn.setAttribute('class', 'like-button')
  likeBtn.textContent = '♥'

  const likes = image.likes


  likeBtn.addEventListener('click', function (){
    likesEl.textContent=likes
    likes++
    render()
  })

  buttonsDiv.append(likesEl, likeBtn)

  const commentsList = document.createElement('ul')
  commentsList.setAttribute('class', 'comments')

  for (const comment of image.comments) {
    const commentLi = document.createElement('li')
    commentLi.textContent = comment.content
    commentsList.append(commentLi)
  }

  articleEl.append(titleEl, imgEl, buttonsDiv, commentsList)
  imageContainerEl.append(articleEl)
}

function renderImages() {

  imageContainerEl.innerHTML = ''

  for (const image of state.images) {
    renderImage(image)
  }
}

function render() {
  renderImages()
}

render()
getImages().then(function (images) {
  state.images = images
  render()
})
