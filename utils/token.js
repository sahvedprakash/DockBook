const tokenId = async (req, res) => {
  const token = req.cookies.jwt;
  const tokenParts = token.split(".");
  const encodedPayload = tokenParts[1];
  const rawPayload = atob(encodedPayload);
  const user = JSON.parse(rawPayload);
  return user.id;
};
module.exports = tokenId;
