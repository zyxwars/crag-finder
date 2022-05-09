export const redirectSsr = (res: any, url: string) => {
  res.writeHead(302, { Location: url });
  res.end();

  // Return this in the main function
  return { props: {} };
};
