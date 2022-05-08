// @ts-ignore iron session typing
export const redirectSsr = (res, url: string) => {
  res.writeHead(302, { Location: url });
  res.end();

  // Return this in the main function
  return { props: {} };
};
