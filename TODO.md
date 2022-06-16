### Add

- Refresh user data on edit
- Add comment avatars
- Refactor to use query and selector files
- Check permission and redirect to login before allowing edit page access, send data to client > allow access to certain data based on permissions
- Allow user with permissions to delete comments without /edit page
- Toggle comment replies

### Fix

- Fix grid
- Fix context default value, todo in comments
- Fix post empty comment, use hook form
- Check api endpoints leaking db fields like password to public
- Fix formidable endpoint without response
- Fix formidable not working on pop os setup

### Long-term

- Delete images when the related record is deleted
- Server side error handling
- Check user permissions serverside
- Add animations, chakra, react spring

### Maybe

- Merge edit with normal page and conditionally display edit options
