### Add

- Fix api to accommodate for prisma refactoring

- Add crag thumbnail, crag photos
- Add search
- Error handling for formidable
- Error handling for all endpoints (trycatch log 500)
- Refresh user data (image >> session) on edit
- Check permission and redirect to login before allowing edit page access, send data to client > allow access to certain data based on permissions

### Fix

- Fix userId Int? @unique auto fill, refactor schemas (Photos, etc)
- Fix context default value, todo in comments
- Fix post empty comment, use hook form
- Check api endpoints leaking db fields like password to public
- Fix formidable endpoint without response

### v 0.1

- Delete images when the related record is deleted

- [x] Visits
- [x] Comments
- [ ] Rating
- [ ] Thumbnail

- [ ] Search by name, tags
- [ ] User edit
- [x] Crag edit

### Future

- Use chakra prose instead of markdown renderer
- Map location
- Map based search
- Visit description
- Direct description image embedding
