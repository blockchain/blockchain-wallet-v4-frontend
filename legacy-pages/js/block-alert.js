$(document).ready(function () {
  var collapsed = false
  $('.dismiss-action').click(function (e) {
    if (!collapsed) {
      collapsed = !collapsed
      $('.alert-open').hide()
      $('.alert-collapsed').show()
    } else {
      collapsed = !collapsed
      $('.alert-open').show()
      $('.alert-collapsed').hide()
    }
  })
  $('.alert-collapsed').hide()
})
