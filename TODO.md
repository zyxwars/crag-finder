### Add

- Add profile edit page
- Allow user with permissions to delete comments without /edit page
- Toggle comment replies
- Refactor to use query and selector files

### Fix

- Fix grid
- Fix context default value, todo in comments
- Fix post empty comment, use hook form
- Check api endpoints leaking db fields like password to public
- Fix formidable endpoint without response

### Long-term

- Delete images when the related record is deleted
- Server side error handling
- Check user permissions serverside
- Add comment avatars
- Merge edit with normal page and conditionally display edit options
- Add animations, chakra, react spring
