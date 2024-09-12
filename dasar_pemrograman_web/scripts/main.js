// --- Dialog klik gambar --- \\

window.dialog = document.querySelector('dialog')

dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    dialog.close()
  }
})

dialog.addEventListener('close', () => {
  document.body.style.overflow = 'auto'
  document.body.style.marginRight = ''
})

dialog.querySelector('button').addEventListener('click', () => {
  dialog.close()
})

document.querySelectorAll('img').forEach(img => {
  img.addEventListener('click', () => {
    dialog.showModal()
    dialog.firstElementChild.innerHTML = `<img src="${img.src}" alt="${img.alt}" />`

    document.body.style.overflow = 'hidden'
    document.body.style.marginRight = '15px'
  })
})

// --- Komentar --- \\
document.querySelector('textarea').addEventListener('input', event => {
  event.target.style.height = '0' // diset 0 untuk ngereset kalo user ngehapus baris
  event.target.style.height = event.target.scrollHeight + 'px'
})

const commentContainer = document.querySelector('#comments')
const errorElement = document.querySelector('#form_error')

const localStorageKey = 'nathanaelgt:dasar_pemrograman_web:comments'
let comments = JSON.parse(localStorage.getItem(localStorageKey)) ?? []

const renderComment = comment => {
  const id = Math.random().toString().slice(2)

  window[`remove_${id}`] = () => {
    document.querySelector(`#comment_${id}`).remove()

    comments = comments.filter(currentComment => currentComment !== comment)

    localStorage.setItem(localStorageKey, JSON.stringify(comments))
  }

  commentContainer.insertAdjacentHTML(
    'beforeend',
    `
<div id="comment_${id}">
  <img src="img/profile_picture.webp" alt="Foto profil ${comment.name}" />

  <div>
    ${comment.name ? `<p>${comment.name}</p>` : `<p class="anonymous">Anonim</p>`}
    <p>${comment.text}</p>
  </div>

  <button onclick="remove_${id}()">x</button>
</div>
`,
  )
}

comments.forEach(renderComment)

document.querySelector('form').addEventListener('submit', event => {
  event.preventDefault()

  const form = new FormData(event.target)

  const comment = {
    name: form.get('name') || null,
    text: form.get('comment'),
  }

  if (comment.text === '') {
    errorElement.innerText = 'Komentar tidak boleh kosong'

    return
  }

  errorElement.innerText = ''

  renderComment(comment)

  comments.push(comment)

  localStorage.setItem(localStorageKey, JSON.stringify(comments))

  event.target.reset()
})
