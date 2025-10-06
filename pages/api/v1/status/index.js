function status(req, res) {
  res.status(200).json({message:"Students from curso.dev are awesome!"});
}

export default status;