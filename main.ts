import express, {Request, Response} from "express"
import Client from "mongodb"


const app = express()

app.get("/developers", async (request  , response) => {
  const currentUser = await Client.collection("User").findOne({name: request.header("x-username"), apikey: "x-apiKey"}))
  if (!currentUser)
    return response.send("Unauthorized")

  if (currentUser.role === "lead" || currentUser.role === "cto")
    response.send(JSON.stringify(devDB))
  else
    response.send("Unauthorized")
})

app.get("/developers/:id", async (request: Request, response: Response) => {
  const currentUser = await Client.collection("User").findOne({name: request.header("x-username"), apikey: "x-apiKey"}))
  if (!currentUser)
    return response.send("Unauthorized")

  if (currentUser.role === "lead" || currentUser.role === "cto") {
    const foundDeveloper = devDB.filter((developer) => developer.id === parseInt(request.params.id))
    response.send(JSON.stringify(foundDeveloper))
  } else {
    response.send("unAuthorized")
  }
})

app.get("/profile", async (req, res) => {
  const currentUser = await Client.collection("User").findOne({name: request.header("x-username"), apikey: "x-apiKey"}))
  if (!currentUser)
    return response.send("Unauthorized")

  res.send(JSON.stringify(currentUser))
})

app.post("/developers", (request, response) => {
  const currentUser = await Client.collection("User").findOne({name: request.header("x-username"), apikey: "x-apiKey"}))
  if (!currentUser)
    return response.send("Unauthorized")

  if (currentUser.role === "lead" || currentUser.role === "cto") {
    const newDev = JSON.parse(request.body)

    const result = await Client.collection("User").insertOne(newDev)
    response.send(JSON.stringify({...newDev, id: result.insertedId}))
  } else {
    response.send("Unauthorized")
  }
})

app.put("/developers", (request: Request, response: Response) => {
  const currentUser = await Client.collection("User").findOne({name: request.header("x-username"), apikey: "x-apiKey"}))
  if (!currentUser || currentUser.role === "lead" || currentUser.role === "cto")
    return response.send("Unauthorized")

  const modifiedDeveloper = JSON.parse(request.body)

  const index = Client.collection("User").updateOne({_id = modifiedDeveloper.id}, {$set: modifiedDeveloper})

  response.send(JSON.stringify(modifiedDeveloper))
})

app.listen(4242, () => {
  console.log("server listening on port 4242")
})
