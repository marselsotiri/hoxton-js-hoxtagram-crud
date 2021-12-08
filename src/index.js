// create state and server
// render based on state
// update state and server
// rerender

const addImageForm = document.querySelector('.add-image-form')
const searchForm = document.querySelector('.search-form')
const imageContainerEl = document.querySelector('.image-container')

const state = {
  images: [],
  filter: '' // this is state only, no server needed
}

// SERVER FUNCTIONS

// getImages :: () => Promise<images>
function getImages() {
  return fetch('http://localhost:3000/images').then(resp => resp.json()) // Promise<images>
}

// createCommentOnServer :: (imageId: number, content: string) => Promise<comment>
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

// createImageOnServer :: (title: string, imageSrc: string) => Promise<image>
function createImageOnServer(title, imageSrc) {
  return fetch('http://localhost:3000/images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title,
      image: imageSrc,
      likes: 0
    })
  }).then(resp => resp.json())
}

// updateImageOnServer :: (image: object) => Promise<image>
function updateImageOnServer(image) {
  return fetch(`http://localhost:3000/images/${image.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(image)
  }).then(resp => resp.json())
}

// deleteCommentOnServer :: (id: number) => Promise<{}>
function deleteCommentOnServer(id) {
  return fetch(`http://localhost:3000/comments/${id}`, {
    method: 'DELETE'
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

  likeBtn.addEventListener('click', function () {
    // increase likes on state
    image.likes++

    // increase likes on server
    updateImageOnServer({ id: image.id, likes: image.likes })

    // render
    render()
  })

  buttonsDiv.append(likesEl, likeBtn)

  const commentsList = document.createElement('ul')
  commentsList.setAttribute('class', 'comments')

  for (const comment of image.comments) {
    const commentLi = document.createElement('li')
    commentLi.textContent = comment.content

    const deleteBtn = document.createElement('button')
    deleteBtn.textContent = '🗑'
    deleteBtn.setAttribute('class', 'delete-comment-btn')

    deleteBtn.addEventListener('click', function () {
      // delete comment on server
      deleteCommentOnServer(comment.id)

      // delete comment on state
      image.comments = image.comments.filter(function (targetComment) {
        return targetComment.id !== comment.id
      })

      // render
      render()
    })

    commentLi.append(deleteBtn)

    commentsList.append(commentLi)
  }

  const addCommentForm = document.createElement('form')
  addCommentForm.setAttribute('class', 'comment-form')

  const commentInput = document.createElement('input')
  commentInput.setAttribute('type', 'text')
  commentInput.setAttribute('class', 'comment-input')
  commentInput.setAttribute('placeholder', 'Enter your comment...')
  commentInput.setAttribute('name', 'comment')

  addCommentForm.append(commentInput)

  addCommentForm.addEventListener('submit', function (event) {
    // prevent form from refreshing the page
    event.preventDefault()

    // create comment on server
    createCommentOnServer(image.id, addCommentForm.comment.value).then(
      function (newCommentFromServer) {
        // add comment to state
        image.comments.push(newCommentFromServer)

        // render
        render()
      }
    )
  })

  articleEl.append(titleEl, imgEl, buttonsDiv, commentsList, addCommentForm)
  imageContainerEl.append(articleEl)
}

function renderImages() {
  // Destroy the images
  imageContainerEl.innerHTML = ''

  const imagesToShow = state.images.filter(image =>
    image.title.toLowerCase().includes(state.filter.toLowerCase())
  )

  // Recreate the images
  for (const image of imagesToShow) {
    renderImage(image)
  }
}

function listenToAddImageForm() {
  addImageForm.addEventListener('submit', function (event) {
    // prevent form from refreshing the page
    event.preventDefault()

    // add image on server
    createImageOnServer(addImageForm.title.value, addImageForm.image.value) // Promise<image>
      .then(function (imageFromServer) {
        // add image on state
        imageFromServer.comments = []
        state.images.push(imageFromServer)

        // rerender
        render()
        addImageForm.reset()
      })
  })
}

function listenToSearchForm() {
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault()
    // update filter
    state.filter = searchForm.search.value
    // rerender page
    render()
  })
}

function render() {
  renderImages()
}

function init() {
  render()
  getImages().then(function (images) {
    // we can guantee that this code runs:
    // - if the fetch worked
    // - when the image data is ready
    state.images = images
    render()
  })
  listenToAddImageForm()
  listenToSearchForm()
}

init()
