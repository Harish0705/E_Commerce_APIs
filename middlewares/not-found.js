const notFound = (req, res) =>
  res.status(404).send("Page does not exists");

export default notFound