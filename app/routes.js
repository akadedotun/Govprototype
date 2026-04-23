//
// For guidance on how to create routes see:
// https://prototype-kit.service.gov.uk/docs/create-routes
//

const govukPrototypeKit = require('govuk-prototype-kit')
const router = govukPrototypeKit.requests.setupRouter()

// ---------------------------------------------------------------
// GET routes — needed so pages know if the user came from "Change"
// ---------------------------------------------------------------

router.get('/dog-licence/dog-details', (req, res) => {
  res.locals.change = req.query.change === 'true'
  res.render('dog-licence/dog-details')
})

router.get('/dog-licence/owner-details', (req, res) => {
  res.locals.change = req.query.change === 'true'
  res.render('dog-licence/owner-details')
})

router.get('/dog-licence/address', (req, res) => {
  res.locals.change = req.query.change === 'true'
  res.render('dog-licence/address')
})

router.get('/dog-licence/licence-type', (req, res) => {
  res.locals.change = req.query.change === 'true'
  res.render('dog-licence/licence-type')
})

// ---------------------------------------------------------------
// POST routes — validate, then render errors or redirect
// ---------------------------------------------------------------

router.post('/dog-licence/dog-details', (req, res) => {
  const d = req.session.data
  const errors = {}
  const errorList = []

  if (!d['dogName'] || !d['dogName'].trim()) {
    errors.dogName = "Enter your dog's name"
    errorList.push({ text: "Enter your dog's name", href: '#dogName' })
  }
  if (!d['breed']) {
    errors.breed = 'Select a breed'
    errorList.push({ text: 'Select a breed', href: '#breed' })
  }
  if (!d['dob-day'] || !d['dob-month'] || !d['dob-year']) {
    errors.dob = "Enter your dog's date of birth"
    errorList.push({ text: "Enter your dog's date of birth", href: '#dob-day' })
  }
  if (!d['microchip'] || !d['microchip'].trim()) {
    errors.microchip = 'Enter the microchip number'
    errorList.push({ text: 'Enter the microchip number', href: '#microchip' })
  }

  if (errorList.length) {
    res.locals.errors = errors
    res.locals.errorList = errorList
    res.locals.change = req.query.change === 'true'
    return res.render('dog-licence/dog-details')
  }

  res.redirect(req.query.change === 'true' ? '/dog-licence/check-answers' : '/dog-licence/owner-details')
})

router.post('/dog-licence/owner-details', (req, res) => {
  const d = req.session.data
  const errors = {}
  const errorList = []

  if (!d['fullName'] || !d['fullName'].trim()) {
    errors.fullName = 'Enter your full name'
    errorList.push({ text: 'Enter your full name', href: '#fullName' })
  }
  if (!d['ownerDob-day'] || !d['ownerDob-month'] || !d['ownerDob-year']) {
    errors.ownerDob = 'Enter your date of birth'
    errorList.push({ text: 'Enter your date of birth', href: '#ownerDob-day' })
  }
  if (!d['email'] || !d['email'].trim()) {
    errors.email = 'Enter your email address'
    errorList.push({ text: 'Enter your email address', href: '#email' })
  }

  if (errorList.length) {
    res.locals.errors = errors
    res.locals.errorList = errorList
    res.locals.change = req.query.change === 'true'
    return res.render('dog-licence/owner-details')
  }

  res.redirect(req.query.change === 'true' ? '/dog-licence/check-answers' : '/dog-licence/address')
})

router.post('/dog-licence/address', (req, res) => {
  const d = req.session.data
  const errors = {}
  const errorList = []

  if (!d['address1'] || !d['address1'].trim()) {
    errors.address1 = 'Enter the first line of your address'
    errorList.push({ text: 'Enter the first line of your address', href: '#address1' })
  }
  if (!d['town'] || !d['town'].trim()) {
    errors.town = 'Enter a town or city'
    errorList.push({ text: 'Enter a town or city', href: '#town' })
  }
  if (!d['postcode'] || !d['postcode'].trim()) {
    errors.postcode = 'Enter a postcode'
    errorList.push({ text: 'Enter a postcode', href: '#postcode' })
  }

  if (errorList.length) {
    res.locals.errors = errors
    res.locals.errorList = errorList
    res.locals.change = req.query.change === 'true'
    return res.render('dog-licence/address')
  }

  res.redirect(req.query.change === 'true' ? '/dog-licence/check-answers' : '/dog-licence/licence-type')
})

router.post('/dog-licence/licence-type', (req, res) => {
  const d = req.session.data
  const errors = {}
  const errorList = []

  if (!d['licenceType']) {
    errors.licenceType = 'Select a licence type'
    errorList.push({ text: 'Select a licence type', href: '#licence-annual' })
  }

  if (errorList.length) {
    res.locals.errors = errors
    res.locals.errorList = errorList
    res.locals.change = req.query.change === 'true'
    return res.render('dog-licence/licence-type')
  }

  res.redirect(req.query.change === 'true' ? '/dog-licence/check-answers' : '/dog-licence/declaration')
})

router.post('/dog-licence/declaration', (req, res) => {
  const errors = {}
  const errorList = []

  // GOV.UK checkboxes always submit as an array (includes '_unchecked' hidden input)
  // so we must use .includes() not === to check the value
  const declaration = [].concat(req.body['declaration'] || [])
  const isConfirmed = declaration.includes('confirmed')

  if (!isConfirmed) {
    errors.declaration = 'You must confirm the declaration to continue'
    errorList.push({ text: 'You must confirm the declaration to continue', href: '#declaration' })
  }

  if (errorList.length) {
    res.locals.errors = errors
    res.locals.errorList = errorList
    return res.render('dog-licence/declaration')
  }

  res.redirect('/dog-licence/check-answers')
})

router.post('/dog-licence/check-answers', (req, res) => {
  // Generate a reference number and save it into session data
  req.session.data['referenceNumber'] = 'FRN-' + Math.floor(1000 + Math.random() * 9000) + '-DOG'
  res.redirect('/dog-licence/confirmation')
})
