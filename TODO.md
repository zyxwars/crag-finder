### Current

- [ ] Fix duplicate code between getStatic and api route - extract from api to universal file
- [ ] Fix visit uploading only single file
- [ ] Allow to upload only images and not files

### Back burner

- [ ] // @ts-ignore req.session will always exist exist after passing withAuthorization middleware
      author: { connect: { id: req.session.user.id } },
- [ ] Fix the linting rules

### Road map

- [ ] Chakra ui
- [ ] withErrorHandling try catch wrapper - overall better error handling system

# App state

## User

- [x] Sign In
- [x] Sign Out
- [ ] Register - [ ] Add password hashing
- [ ] GET
- [ ] PUT
- [ ] DELETE

## Crag

- [x] GET
- [x] POST
- [ ] PUT
- [ ] DELETE - [ ] Check privileges

### Comments

- [ ]

## Visit

- [x] GET
- [ ] POST - [ ] Multiple images - [ ] Allow only image type
- [ ] PUT
- [ ] DELETE - [ ] Check privileges
