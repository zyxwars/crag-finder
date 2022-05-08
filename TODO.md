- [ ] // @ts-ignore req.session will always exist exist after passing withAuthorization middleware
      author: { connect: { id: req.session.user.id } },
