import express, {Request, Response} from "express"
import developers from "./developers"

const devDB = developers

const app = express()

app.get("/developers", (request  , response) => {
  const currentUser = devDB.find((developer: any) => developer.username === request.header("x-username"))
  if (!currentUser)
    return response.send("Unauthorized")

  if (currentUser.role === "lead" || currentUser.role === "cto")
    response.send(JSON.stringify(devDB))
  else
    response.send("Unauthorized")
})

app.get("/developers/:id", (request: Request, response: Response) => {
  const currentUser = devDB.filter((developer) => developer.username === request.header("x-username"))[0]
  if (!currentUser)
    return response.send("Unauthorized")

  if (currentUser.role === "lead" || currentUser.role === "cto") {
    const foundDeveloper = devDB.filter((developer) => developer.id === parseInt(request.params.id))
    response.send(JSON.stringify(foundDeveloper))
  } else {
    response.send("unAuthorized")
  }
})

app.get("/profile", (req, res) => {
  const currentUser = devDB.find((developer) => developer.username === req.header("x-username"))
  if (!currentUser)
    return res.send("Unauthorized")

  res.send(JSON.stringify(currentUser))
})

app.post("/developers", (request, response) => {
  const currentUser = devDB.find((developer: any) => developer.username === request.header("x-username"))
  if (!currentUser)
    return response.send("Unauthorized")

  if (currentUser.role === "lead" || currentUser.role === "cto") {
    const newDev = JSON.parse(request.body)
    newDev.id = devDB.length + 1

    devDB.push(newDev)

    response.send(JSON.stringify(newDev))
  } else {
    response.send("Unauthorized")
  }
})

app.put("/developers", (request: Request, response: Response) => {
  const currentUser = devDB.find((developer: any) => developer.username === request.header("x-username"))
  if (!currentUser || currentUser.role === "lead" || currentUser.role === "cto")
    return response.send("Unauthorized")

  const modifiedDeveloper = JSON.parse(request.body)

  const index = devDB.findIndex((developer) => developer.id = modifiedDeveloper.id)

  devDB[index] = modifiedDeveloper

  response.send(JSON.stringify(modifiedDeveloper))
})

app.listen(4242, () => {
  console.log("server listening on port 4242")
})
